const mongoose = require("mongoose");
const renterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  lastName: {
    type: String,
    required: true,
    min: 1,
    max: 500,
  },
  property: [{ propertyType: String, id: mongoose.Types.ObjectId }], //property type will be Car or House
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  city: { type: mongoose.Types.ObjectId, ref: "City" },
  subCity: { id: mongoose.Types.ObjectId, name: Sting },
  posts: [mongoose.Types.ObjectId],
  balance: Number,
});

const Renter = mongoose.model("Renter", renterSchema);
module.exports = Renter;
