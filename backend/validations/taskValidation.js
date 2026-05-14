const { body } = require('express-validator');

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().trim(),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
  body('status').optional().isIn(['Todo', 'In Progress', 'Completed']).withMessage('Invalid status'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('assignedTo').isMongoId().withMessage('Valid assignee is required'),
  body('projectId').isMongoId().withMessage('Valid project is required')
];

module.exports = taskValidation;
