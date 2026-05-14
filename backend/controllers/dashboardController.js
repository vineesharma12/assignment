const asyncHandler = require('../utils/asyncHandler');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

const getStats = asyncHandler(async (req, res) => {
  const projectFilter =
    req.user.role === 'Admin'
      ? {}
      : { $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }] };
  const taskFilter = req.user.role === 'Admin' ? {} : { assignedTo: req.user._id };
  const now = new Date();

  const [totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks, statusCounts, priorityCounts, recentActivity] =
    await Promise.all([
      Project.countDocuments(projectFilter),
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: 'Completed' }),
      Task.countDocuments({ ...taskFilter, status: { $ne: 'Completed' } }),
      Task.countDocuments({ ...taskFilter, status: { $ne: 'Completed' }, dueDate: { $lt: now } }),
      Task.aggregate([
        { $match: taskFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: taskFilter },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Activity.find()
        .populate('actor', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(8)
    ]);

  res.json({
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    statusCounts: statusCounts.map((item) => ({ name: item._id, value: item.count })),
    priorityCounts: priorityCounts.map((item) => ({ name: item._id, value: item.count })),
    recentActivity
  });
});

module.exports = { getStats };
