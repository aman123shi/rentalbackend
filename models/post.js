const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  postType: {
    //House or Car
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  property: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: function () {
      return this.postType;
    },
  },

  renter: { type: mongoose.Types.ObjectId, ref: "Renter" },
  city: String,
  verifiedBy: { type: mongoose.Types.ObjectId, ref: "Agent" },
  subCity: { id: mongoose.Types.ObjectId, name: Sting },
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
