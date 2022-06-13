const Joi = require("joi");
module.exports = function (category) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    bedrooms: Joi.boolean().required(),
    bathrooms: Joi.boolean().required(),
  });
  const { error } = schema.validate(category);
  return error;
};
