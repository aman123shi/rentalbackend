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
  subCity: { id: mongoose.Types.ObjectId, name: String },
  images: [String],
  city: {
    id: mongoose.Types.ObjectId,
    name: String,
  },
  features: [String],
  isVerified: Boolean,
  status: String, // posted pending declined
  category: {
    type: mongoose.Types.ObjectId,
    ref: "HouseCategory",
    populate: true,
  },
  owner: { type: mongoose.Types.ObjectId, ref: "Renter" },
  quantity: Number,
});

const House = mongoose.model("House", houseSchema);
module.exports = House;
