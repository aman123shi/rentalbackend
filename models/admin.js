const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const adminSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
});
adminSchema.methods.generateAuthToken = function () {
  let token = jwt.sign(
    {
      id: this._id,
      userType: "admin",
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
adminSchema.methods.hashPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
