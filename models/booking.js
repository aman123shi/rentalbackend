const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  propertyType: {
    //House or Car
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  house: {
    type: mongoose.Types.ObjectId,
    ref: "House",
  },
  car: {
    type: mongoose.Types.ObjectId,
    ref: "Car",
  },
  renter: { type: mongoose.Types.ObjectId, ref: "Renter" },
  tenant: { type: mongoose.Types.ObjectId, ref: "Renter" },
  verifiedBy: { type: mongoose.Types.ObjectId, ref: "Agent" },
  propertyCity: { type: mongoose.Types.ObjectId },
  subCity: String,
  amount: Number,
  status: String, //to be verified after tenant see the house
  paymentStatus: String, //payed
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
