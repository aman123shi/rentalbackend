const Joi = require("joi");
module.exports = function (renter) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(40).required(),
    lastName: Joi.string().min(3).max(40).required(),
    phone: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    subCity: {
      id: Joi.objectId(),
      name: Joi.string().min(1).max(40),
    },
    city: Joi.objectId(),
    password: Joi.string().min(6).max(20).required(),
  });
  const { error } = schema.validate(renter);

  return error;
};
