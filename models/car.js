const mongoose = require("mongoose");
const carSchema = new mongoose.Schema(
  {
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
    prePaidPaymentTerm: Number, // must payed for 1 month or 2,3,4.....
    color: String,
    bodyType: String,
    engineType: String,
    transmission: String,
    features: [String],
    images: [String],
    city: {
      type: mongoose.Types.ObjectId,
      ref: "City",
    },
    category: String,
    make: String,
    status: String,
    agentComment: String,
    agent: { type: mongoose.Types.ObjectId, ref: "Agent" },
    isVerified: Boolean,
    isApproved: Boolean,
    owner: { type: mongoose.Types.ObjectId, ref: "Renter" },
    model: String, // user provided field
    quantity: Number,
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
