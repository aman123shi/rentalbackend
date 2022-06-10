const mongoose = require("mongoose");
const adSchema = new mongoose.Schema({
  adType: {
    //featured products or other commercial
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
  endDate: {
    type: Date,
    default: function () {
      return this.createdAt * duration;
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Ad = mongoose.model("Ad", adSchema);
module.export = Ad;
