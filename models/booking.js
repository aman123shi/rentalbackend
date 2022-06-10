const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  propertyType: {
    //House or Car
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  property: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: function () {
      return this.propertyType;
    },
  },

  propertyRenter: { type: mongoose.Types.ObjectId, ref: "Renter" },
  tenant: { type: mongoose.Types.ObjectId, ref: "Renter" },
  propertyCity: String,
  verifiedBy: { type: mongoose.Types.ObjectId, ref: "Agent" },
  propertySubCity: { id: mongoose.Types.ObjectId, name: Sting },
  status: String,
  paymentStatus: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.export = Booking;
