const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (verification) {
  const schema = Joi.object({
    properties: Joi.array().items(
      Joi.object({
        id: Joi.objectId().required(),
        propertyType: Joi.string().required(),
      })
    ),
    renter: Joi.objectId().required(),
    description: Joi.string().max(500),
    subCity: Joi.string(),
    city: Joi.objectId(),
    companyType: Joi.string().max(50).required(),
  });
  const { error } = schema.validate(verification);

  return error;
};
