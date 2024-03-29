const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (car) {
  const schema = Joi.object({
    headerTitle: Joi.string().min(3).max(40).required(),
    description: Joi.string().min(3).max(500).required(),
    price: Joi.number().required(),
    pricingRate: Joi.string().required(),
    mileage: Joi.number(),
    prePaidPaymentTerm: Joi.string().number(),
    color: Joi.string().required(),
    bodyType: Joi.string().required(),
    engineType: Joi.string().required(),
    transmission: Joi.string().required(),
    city: Joi.objectId(),
    category: Joi.string(),
    features: Joi.array().items(Joi.string().max(30)),
    quantity: Joi.number().required(),
    make: Joi.string().max(40),
    images: Joi.array().items(Joi.string().max(255)),
    model: Joi.string(),
    isVerified: Joi.boolean(),
    isApproved: Joi.boolean(),
    paymentConfirmationDays: Joi.number(),
    paymentDeadline: Joi.number(),
  });
  const { error } = schema.validate(car);
  return error;
};
