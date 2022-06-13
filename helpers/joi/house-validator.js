const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (house) {
  const schema = Joi.object({
    headerTitle: Joi.string().min(3).max(40).required(),
    description: Joi.string().min(3).max(500).required(),
    price: Joi.number().required(),
    pricingRate: Joi.number().required(),
    size: Joi.number().required(),
    prePaidPaymentTerm: Joi.string().number(),
    location: {
      lat: Joi.number(),
      lng: Joi.number(),
    },
    city: {
      id: Joi.objectId(),
      name: Joi.string().min(1).max(40),
    },
    subCity: {
      id: Joi.objectId(),
      name: Joi.string().min(1).max(40),
    },
    category: Joi.objectId(),
    features: Joi.array().items(Joi.string().max(30)),
    images: Joi.array().items(Joi.string().max(255)),
    quantity: Joi.number().required(),
    make: Joi.string().max(40),
    model: Joi.objectId(),
    isVerified: Joi.boolean(),
  });
  const { error } = schema.validate(house);
  return error;
};
