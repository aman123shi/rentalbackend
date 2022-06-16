const mongoose = require("mongoose");
const carCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 40,
  },
});

const CarCategory = mongoose.model("CarCategory", carCategorySchema);
module.exports = CarCategory;
