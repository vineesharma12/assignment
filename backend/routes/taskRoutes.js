const express = require('express');
const { listTasks, createTask, updateTask, deleteTask, addComment } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const taskValidation = require('../validations/taskValidation');

const router = express.Router();

router.route('/').get(protect, listTasks).post(protect, authorize('Admin'), taskValidation, validate, createTask);
router
  .route('/:id')
  .put(protect, updateTask)
  .delete(protect, authorize('Admin'), deleteTask);
router.post('/:id/comments', protect, addComment);

module.exports = router;
