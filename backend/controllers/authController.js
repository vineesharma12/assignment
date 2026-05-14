const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, avatar } = req.body;
  const exists = await User.findOne({ email });

  if (exists) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, role, avatar });

  res.status(201).json({
    user: userResponse(user),
    token: generateToken(user._id)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    user: userResponse(user),
    token: generateToken(user._id)
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: userResponse(req.user) });
});

module.exports = { register, login, me };
