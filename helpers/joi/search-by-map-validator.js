const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (criteria) {
  const schema = Joi.object({
    category: Joi.string().min(3).max(40).required(),
    minPrice: Joi.number().required(),
    maxPrice: Joi.number().required(),
    bathroom: Joi.number(),
    bedroom: Joi.number(),
    center: { lng: Joi.number().required(), lat: Joi.number().required() },
    radius: Joi.number().required(),
  });
  const { error } = schema.validate(criteria);
  return error;
};
