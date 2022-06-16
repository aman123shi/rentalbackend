const mongoose = require("mongoose");
const carMakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 40,
  },
});

const CarMake = mongoose.model("CarMake", carMakeSchema);
module.exports = CarMake;
