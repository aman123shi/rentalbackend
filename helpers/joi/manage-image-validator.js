const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (imageData) {
  const schema = Joi.object({
    propertyType: Joi.string().max(500),
    imagePath: Joi.string().required(),
  });
  const { error } = schema.validate(imageData);

  return error;
};
