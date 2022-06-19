const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  postType: {
    //House or Car
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  house: {
    type: mongoose.Types.ObjectId,
    ref: "House",
  },
  car: {
    type: mongoose.Types.ObjectId,
    ref: "Car",
  },
  propertyCategory: String,
  renter: { type: mongoose.Types.ObjectId, ref: "Renter" },
  city: { type: mongoose.Types.ObjectId, ref: "City" },
  verifiedBy: { type: mongoose.Types.ObjectId, ref: "Agent" },
  subCity: String,
  isAgentPost: Boolean,
  agent: { type: mongoose.Types.ObjectId, ref: "Agent" },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
