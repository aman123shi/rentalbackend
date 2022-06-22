const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (renter) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(40).required(),
    lastName: Joi.string().min(3).max(40).required(),
    phone: Joi.string().min(3).max(20).required(),
    email: Joi.string().email(),
    subCity: {
      id: Joi.objectId(),
      name: Joi.string().min(1).max(40),
    },
    city: Joi.objectId(),
    password: Joi.string().min(6).max(20).required(),
    hash: Joi.string().min(6).max(500).required(),
    otp: Joi.string().min(4).max(20).required(),
  });
  const { error } = schema.validate(renter);

  return error;
};
