const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (agent) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(40).required(),
    lastName: Joi.string().min(3).max(40).required(),
    phone: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
    city: Joi.objectId(),
    subCity: Joi.array().items({
      name: Joi.string().min(1).max(40),
    }),
    privilege: Joi.array().items(
      Joi.object({
        name: Joi.string().max(50),
        r: Joi.boolean(),
        w: Joi.boolean(),
        u: Joi.boolean(),
        d: Joi.boolean(),
        condition: Joi.string(),
      })
    ),
  });
  const { error } = schema.validate(agent);
  console.log("message :", JSON.stringify(error));
  return error;
};
