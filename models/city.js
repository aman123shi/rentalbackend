const mongoose = require("mongoose");
const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 40,
  },
  subCity: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        auto: true,
        index: true,
        required: true,
      },
      name: String,
    },
  ],
});

const City = mongoose.model("City", citySchema);
module.exports = City;
