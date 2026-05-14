const Activity = require('../models/Activity');

const logActivity = async ({ actor, action, entityType, entityId, message }) => {
  await Activity.create({ actor, action, entityType, entityId, message });
};

module.exports = logActivity;
