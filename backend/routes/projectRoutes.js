const express = require('express');
const {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const projectValidation = require('../validations/projectValidation');

const router = express.Router();

router.route('/').get(protect, listProjects).post(protect, authorize('Admin'), projectValidation, validate, createProject);
router
  .route('/:id')
  .get(protect, getProject)
  .put(protect, authorize('Admin'), projectValidation, validate, updateProject)
  .delete(protect, authorize('Admin'), deleteProject);
router.post('/:id/members', protect, authorize('Admin'), addMember);
router.delete('/:id/members/:userId', protect, authorize('Admin'), removeMember);

module.exports = router;
