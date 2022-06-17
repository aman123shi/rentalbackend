const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (criteria) {
  const schema = Joi.object({
    category: Joi.string().min(3).max(40).required(),
    minPrice: Joi.number().required(),
    maxPrice: Joi.number().required(),
    subCity: Joi.string().max(255),
    city: Joi.objectId().required(),
    bathroom: Joi.number(),
    bedroom: Joi.number(),
  });
  const { error } = schema.validate(criteria);
  return error;
};
