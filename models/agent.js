const mongoose = require("mongoose");
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
  subCity: { id: mongoose.Types.ObjectId, name: Sting },
  privillage: [
    {
      name: String, //this will be the Model Name which the privillage is given
      r: Boolean,
      w: Boolean,
      u: Boolean,
      d: Boolean,
      condition: String,
    },
  ],
});

const Agent = mongoose.model("Agent", agentSchema);
module.export = Agent;
