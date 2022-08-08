const mongoose = require("mongoose");
const houseCategoryModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 1,
      max: 40,
    },
    bedrooms: Boolean,
    bathrooms: Boolean,
  },
  { timestamps: true }
);

const HouseCategory = mongoose.model("HouseCategory", houseCategoryModelSchema);
module.exports = HouseCategory;
