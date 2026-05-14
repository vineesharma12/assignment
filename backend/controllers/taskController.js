const asyncHandler = require('../utils/asyncHandler');
const Project = require('../models/Project');
const Task = require('../models/Task');
const logActivity = require('../utils/activityLogger');

const canSeeTask = (task, user) => {
  return (
    user.role === 'Admin' ||
    task.assignedTo._id?.equals?.(user._id) ||
    task.assignedTo.equals?.(user._id) ||
    task.createdBy._id?.equals?.(user._id) ||
    task.createdBy.equals?.(user._id)
  );
};

const listTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, projectId, page = 1, limit = 20 } = req.query;
  const query = {};

  if (req.user.role !== 'Admin') query.assignedTo = req.user._id;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (projectId) query.projectId = projectId;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar role')
      .populate('projectId', 'title status')
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(Number(limit)),
    Task.countDocuments(query)
  ]);

  res.json({ tasks, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
});

const createTask = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!project.teamMembers.some((member) => member.toString() === req.body.assignedTo)) {
    project.teamMembers.push(req.body.assignedTo);
    await project.save();
  }

  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  await logActivity({
    actor: req.user._id,
    action: 'created',
    entityType: 'Task',
    entityId: task._id,
    message: `Created task "${task.title}"`
  });

  res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role !== 'Admin') {
    if (!task.assignedTo.equals(req.user._id)) {
      res.status(403);
      throw new Error('Members can update only their assigned tasks');
    }
    task.status = req.body.status ?? task.status;
  } else {
    ['title', 'description', 'priority', 'status', 'dueDate', 'assignedTo', 'projectId'].forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });
  }

  await task.save();
  await logActivity({
    actor: req.user._id,
    action: 'updated',
    entityType: 'Task',
    entityId: task._id,
    message: `Updated task "${task.title}"`
  });

  res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();
  await logActivity({
    actor: req.user._id,
    action: 'deleted',
    entityType: 'Task',
    entityId: task._id,
    message: `Deleted task "${task.title}"`
  });

  res.json({ message: 'Task deleted' });
});

const addComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (!canSeeTask(task, req.user)) {
    res.status(403);
    throw new Error('Forbidden');
  }

  task.comments.push({ user: req.user._id, text: req.body.text });
  await task.save();
  res.status(201).json(task);
});

module.exports = { listTasks, createTask, updateTask, deleteTask, addComment };
