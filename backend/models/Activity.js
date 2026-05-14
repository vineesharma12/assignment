const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entityType: { type: String, enum: ['Project', 'Task', 'User'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
