const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const agentSchema = new mongoose.Schema({
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
  city: { type: mongoose.Types.ObjectId, ref: "City" },
  subCity: [{ name: String }],
  privilege: [
    {
      name: String, //this will be the Model Name in which the privilege is given
      r: Boolean,
      w: Boolean,
      u: Boolean,
      d: Boolean,
      condition: String,
    },
  ],
});
agentSchema.methods.generateAuthToken = function () {
  let token = jwt.sign(
    {
      id: this._id,
      privilege: this.privilege,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
agentSchema.methods.hashPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};
const Agent = mongoose.model("Agent", agentSchema);
module.exports = Agent;
