const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (house) {
  const schema = Joi.object({
    headerTitle: Joi.string().min(3).max(40).required(),
    description: Joi.string().min(3).max(500).required(),
    price: Joi.number().required(),
    pricingRate: Joi.string().required(),
    size: Joi.number().required(),
    bedroom: Joi.number(),
    bathroom: Joi.number(),
    prePaidPaymentTerm: Joi.number(),
    location: {
      lat: Joi.number(),
      lng: Joi.number(),
    },
    city: Joi.objectId(),
    subCity: Joi.string().min(1).max(40),
    category: Joi.string(),
    features: Joi.array().items(Joi.string().max(30)),
    images: Joi.array().items(Joi.string().max(255)),
    quantity: Joi.number().required(),
    isVerified: Joi.boolean(),
  });
  const { error } = schema.validate(house);
  return error;
};
