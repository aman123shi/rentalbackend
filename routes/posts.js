const _ = require("lodash");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const Post = require("../models/house");
const validateObjectId = require("../middlewares/validdateObjectId");
const Renter = require("../models/renter");
const Agent = require("../models/agent");
const Post = require("../models/post");
const validatePostUpdate = require("../helpers/joi/update-post-validator");
const Car = require("../models/car");
const guard = require("../middlewares/guard");
const adminGuard = require("../middlewares/adminGuard");
const House = require("../models/house");

//GET api/posts
router.get("/", adminGuard, async (req, res) => {
  let subCity = [],
    cityId,
    status = req.query.status,
    pageNumber = 1,
    limit = 10,
    query = {};
  if (req.user.userType === "agent") {
    let agent = await Agent.findById(req.user.id);
    cityId = agent._id;
    for (let sc of agent.subCity) subCity.push(sc.name);
    query = { city: cityId, "subCity.name": { $in: subCity } };
  }
  if (status) query.status = status;
  const posts = await Post.find(query)
    .sort("createdAt")
    .select("-__v")
    .skip((pageNumber - 1) * limit) //pagination
    .limit(limit); // items per page
  res.send({ success: true, body: posts });
});
//agents create verified listing

//PUT api/posts
// agent approval or decline will be done using this end points
router.put("/:id", validateObjectId, async (req, res) => {
  function sendSuccess() {
    res
      .status(200)
      .send({ success: true, message: "post updated successfully" });
  }
  let house, car;
  const error = validatePostUpdate(req.body);

  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  if (req.body.status == "active") {
    req.body.updatedAt = new Date();
    let post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: _.pick(req.body, ["status", "updatedAt"]),
      },
      {
        new: true,
      }
    );
    if (!post) {
      res
        .status(404)
        .send({ success: false, message: "post not found with this id " });
      return;
    }
    //updating the house or car status

    if (req.body.propertyType == "House") {
      house = await House.findByIdAndUpdate(req.body.propertyId, {
        $set: {
          isApproved: true,
          status: "active",
          agentComment: req.body.agentComment,
        },
      });
      sendSuccess();
      return;
    } else if (req.body.propertyType == "Car") {
      car = await Car.findByIdAndUpdate(req.body.propertyId, {
        $set: {
          isApproved: true,
          status: "active",
          agentComment: req.body.agentComment,
        },
      });
      sendSuccess();
      return;
    }
  } else if (req.body.status == "declined") {
    let post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      res
        .status(404)
        .send({ success: false, message: "post not found with this id " });
      return;
    }
    if (req.body.propertyType == "House") {
      house = await House.findByIdAndUpdate(req.body.propertyId, {
        $set: {
          isApproved: false,
          status: "declined",
          agentComment: req.body.agentComment,
        },
      });
      sendSuccess();
      return;
    } else if (req.body.propertyType == "Car") {
      car = await Car.findByIdAndUpdate(req.body.propertyId, {
        $set: {
          isApproved: false,
          status: "declined",
          agentComment: req.body.agentComment,
        },
      });
    }
    sendSuccess();
    return;
  }
});
module.exports = router;
