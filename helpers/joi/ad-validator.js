const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (ad) {
  const schema = Joi.object({
    adType: Joi.string().min(3).max(40).required(),
    duration: Joi.number(),
    title: Joi.string().min(3).max(20).required(),
    description: Joi.string().max(255).required(),
    postedBy: Joi.objectId().required(),
    status: Joi.string().min(3).max(20).required(),
    images: Joi.array().items(),
  });
  const { error } = schema.validate(ad);
  return error;
};
