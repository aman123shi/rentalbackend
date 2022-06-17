const mongoose = require("mongoose");
const adSchema = new mongoose.Schema({
  adType: {
    //House or Car products or other commercial
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  duration: Number, // number of the days ad will be posted
  title: String,
  description: String,
  owner: {
    name: String,
    phone: String,
  },
  city: String,
  postedBy: { type: mongoose.Types.ObjectId, ref: "Admin" },
  status: String,
  images: [String],
  endDate: {
    type: Date,
    default: function () {
      return this.updatedAt;
    },
  },
  house: {
    type: mongoose.Types.ObjectId,
    ref: "House",
  },
  car: {
    type: mongoose.Types.ObjectId,
    ref: "Car",
  },
  viewCounter: { type: Number, default: 0 },
  clickCounter: { type: Number, default: 0 },
  viewLimit: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Ad = mongoose.model("Ad", adSchema);
module.exports = Ad;
