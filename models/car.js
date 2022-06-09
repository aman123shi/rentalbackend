const mongoose = require("mongoose");
const carSchema = new mongoose.Schema({
  headerTitle: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  description: {
    type: String,
    required: true,
    min: 1,
    max: 500,
  },
  price: {
    type: Number,
    required: true,
  },
  pricingRate: {
    //this is eg in 1 day
    type: Number,
    required: true,
    default: 1,
  },
  milage: {
    //this is eg in 1 day
    type: Number,
  },
  color: String,
  bodyType: String,
  engineType: String,
  transmission: String,
  features: [String],
  images: [String],
  city: String,
  make: String,
  isVerified: Boolean,
  model: { type: mongoose.Types.ObjectId, ref: "CarModel", populate: true },
});

const Car = mongoose.model("Car", carSchema);
module.export = Car;
