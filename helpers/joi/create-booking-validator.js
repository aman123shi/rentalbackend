const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (booking) {
  const schema = Joi.object({
    propertyType: Joi.string().max(20).required(),
    property: Joi.objectId().required(),
    subCity: Joi.string(),
    city: Joi.objectId(),
  });
  const { error } = schema.validate(booking);

  return error;
};
