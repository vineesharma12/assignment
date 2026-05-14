const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    throw new Error(errors.array().map((error) => error.msg).join(', '));
  }
  next();
};

module.exports = validate;
