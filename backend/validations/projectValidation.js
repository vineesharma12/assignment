const { body } = require('express-validator');

const projectValidation = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').optional().trim(),
  body('status').optional().isIn(['Active', 'Completed', 'Archived']).withMessage('Invalid status'),
  body('teamMembers').optional().isArray().withMessage('Team members must be an array')
];

module.exports = projectValidation;
