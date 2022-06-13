const Joi = require("joi");
module.exports = function (agent) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(40).required(),
    lastName: Joi.string().min(3).max(40).required(),
    phone: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });
  const { error } = schema.validate(agent);
  return error;
};
