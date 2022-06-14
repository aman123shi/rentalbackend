const Joi = require("joi");
module.exports = function (city) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(40).required(),
    subCity: Joi.array()
      .items({ name: Joi.string().max(50) })
      .required(),
  });
  const { error } = schema.validate(city);
  return error;
};
