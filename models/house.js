const mongoose = require("mongoose");
const houseSchema = new mongoose.Schema({
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
  size: {
    //this is eg 4m square
    type: Number,
  },
  prePaidPaymentTerm: Number, // must payed for 1 month or 2,3,4.....
  location: {
    lat: Number,
    lng: Number,
  },
  subCity: { id: mongoose.Types.ObjectId, name: Sting },
  images: [String],
  city: { type: mongoose.Types.ObjectId, ref: "City" },
  features: [String],
  isVerified: Boolean,
  category: {
    type: mongoose.Types.ObjectId,
    ref: "HouseCategory",
    populate: true,
  },
});

const House = mongoose.model("House", houseSchema);
module.export = House;
