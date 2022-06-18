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
    //this is per month per year
    type: String,
    required: true,
    default: 1,
  },
  size: {
    //this is eg 4m square
    type: Number,
  },
  prePaidPaymentTerm: Number, // must payed for 1 month or 2,3,4.....
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  bathroom: Number,
  bedroom: Number,
  subCity: String,
  images: [String],
  city: { type: mongoose.Types.ObjectId, ref: "City" },

  features: [String],
  isVerified: Boolean,
  isApproved: Boolean,
  status: { type: String, default: "pending" }, // posted pending declined
  category: String,
  owner: { type: mongoose.Types.ObjectId, ref: "Renter" },
  quantity: Number,
});
houseSchema.index({ location: "2dsphere" });
const House = mongoose.model("House", houseSchema);

module.exports = House;
