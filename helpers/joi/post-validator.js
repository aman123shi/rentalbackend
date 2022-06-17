const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (post) {
  const schema = Joi.object({
    postType: Joi.string().min(3).max(40).required(),
    property: Joi.objectId().required(),
    propertyCategory: Joi.string().min(3).max(20).required(),
    city: Joi.string().required(),
    renter: Joi.objectId().required(),
    verifiedBy: Joi.objectId(),
    subCity: Joi.string(),
    status: Joi.string(),
  });
  const { error } = schema.validate(post);
  return error;
};
