const mongoose = require("mongoose");
const verificationRequestSchema = new mongoose.Schema({
  properties: [
    {
      id: mongoose.Types.ObjectId,
      propertyType: String, //House or Car
    },
  ],

  renter: { type: mongoose.Types.ObjectId, ref: "Renter" },
  city: mongoose.Types.ObjectId,
  verifiedBy: { type: mongoose.Types.ObjectId, ref: "Agent" },
  subCity: String,
  status: { type: String, default: "pending" },
  description: String,
  companyType: String,
  paymentStatus: String,
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});

const VerificationRequest = mongoose.model(
  "VerificationRequest",
  verificationRequestSchema
);
module.exports = VerificationRequest;
