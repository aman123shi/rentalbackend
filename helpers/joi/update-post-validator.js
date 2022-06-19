const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (criteria) {
  const schema = Joi.object({
    status: Joi.string().min(3).max(40).required(),
    propertyType: Joi.string().required(),
    propertyId: Joi.objectId().required(),
    agentComment: Joi.string(),
  });
  const { error } = schema.validate(criteria);
  return error;
};
