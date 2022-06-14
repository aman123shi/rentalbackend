const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
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
renterSchema.methods.generateAuthToken = function () {
  let token = jwt.sign(
    {
      id: this._id,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
renterSchema.methods.hashPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};
const Renter = mongoose.model("Renter", renterSchema);
module.exports = Renter;
