const { body } = require('express-validator');

const strongPasswordMessage =
  'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol';

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
    .withMessage(strongPasswordMessage),
  body('role').optional().isIn(['Admin', 'Member']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

module.exports = { registerValidation, loginValidation };
