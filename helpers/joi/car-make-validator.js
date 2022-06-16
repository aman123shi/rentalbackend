const Joi = require("joi");
module.exports = function (category) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(40).required(),
  });
  const { error } = schema.validate(category);
  return error;
};
