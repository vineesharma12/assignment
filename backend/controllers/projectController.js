const asyncHandler = require('../utils/asyncHandler');
const Project = require('../models/Project');
const Task = require('../models/Task');
const logActivity = require('../utils/activityLogger');

const getProjectOrFail = async (id) => {
  const project = await Project.findById(id);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

const canAccessProject = (project, user) => {
  return (
    user.role === 'Admin' ||
    project.createdBy.equals(user._id) ||
    project.teamMembers.some((member) => member.equals(user._id))
  );
};

const listProjects = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === 'Admin'
      ? {}
      : { $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }] };

  const projects = await Project.find(filter)
    .populate('createdBy', 'name email avatar role')
    .populate('teamMembers', 'name email avatar role')
    .sort({ createdAt: -1 });

  res.json(projects);
});

const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email avatar role')
    .populate('teamMembers', 'name email avatar role');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!canAccessProject(project, req.user)) {
    res.status(403);
    throw new Error('Forbidden');
  }

  const tasks = await Task.find({ projectId: project._id })
    .populate('assignedTo', 'name email avatar role')
    .populate('createdBy', 'name email avatar role')
    .sort({ dueDate: 1 });

  res.json({ project, tasks });
});

const createProject = asyncHandler(async (req, res) => {
  const teamMembers = Array.from(new Set([...(req.body.teamMembers || []), req.user._id.toString()]));
  const project = await Project.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    teamMembers,
    createdBy: req.user._id
  });

  await logActivity({
    actor: req.user._id,
    action: 'created',
    entityType: 'Project',
    entityId: project._id,
    message: `Created project "${project.title}"`
  });

  res.status(201).json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await getProjectOrFail(req.params.id);
  Object.assign(project, {
    title: req.body.title ?? project.title,
    description: req.body.description ?? project.description,
    status: req.body.status ?? project.status,
    teamMembers: req.body.teamMembers ?? project.teamMembers
  });
  await project.save();

  await logActivity({
    actor: req.user._id,
    action: 'updated',
    entityType: 'Project',
    entityId: project._id,
    message: `Updated project "${project.title}"`
  });

  res.json(project);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await getProjectOrFail(req.params.id);
  await Task.deleteMany({ projectId: project._id });
  await project.deleteOne();

  await logActivity({
    actor: req.user._id,
    action: 'deleted',
    entityType: 'Project',
    entityId: project._id,
    message: `Deleted project "${project.title}"`
  });

  res.json({ message: 'Project deleted' });
});

const addMember = asyncHandler(async (req, res) => {
  const project = await getProjectOrFail(req.params.id);
  if (!project.teamMembers.includes(req.body.userId)) {
    project.teamMembers.push(req.body.userId);
    await project.save();
  }
  res.json(project);
});

const removeMember = asyncHandler(async (req, res) => {
  const project = await getProjectOrFail(req.params.id);
  project.teamMembers = project.teamMembers.filter((member) => member.toString() !== req.params.userId);
  await project.save();
  res.json(project);
});

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
