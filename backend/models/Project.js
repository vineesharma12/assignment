const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['Active', 'Completed', 'Archived'], default: 'Active' }
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Project', projectSchema);
