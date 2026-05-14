const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('name email role avatar createdAt').sort({ name: 1 });
  res.json(users);
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'avatar'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });

  await req.user.save();
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar
  });
});

module.exports = { listUsers, updateProfile };
