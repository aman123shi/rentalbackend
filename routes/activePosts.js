const _ = require("lodash");
const express = require("express");
const router = express.Router();
const House = require("../models/house");
const Car = require("../models/car");
const validateObjectId = require("../middlewares/validdateObjectId");
const Renter = require("../models/renter");
const Agent = require("../models/agent");
const Post = require("../models/post");
const validateHouse = require("../helpers/joi/house-validator");
const guard = require("../middlewares/guard");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
//property status => active inactive pending declined
//if quantity = o remove from active listing just set quantity 0 to remove from active listing
//PUT api/active-posts/update-quantity
router.put("/update-quantity", guard, async (req, res) => {
  const error = validateUpdateQuantity(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  let propertyType = req.body.propertyType,
    property;
  let postQuery = { postType: propertyType };
  let propertyQuery = { quantity: req.body.quantity };
  if (propertyType === "House") {
    postQuery.house = req.body.propertyId;
  } else if (propertyType === "Car") {
    postQuery.car = req.body.propertyId;
  }
  if (Number.parseInt(req.body.quantity) == 0) {
    await Post.findOneAndDelete(postQuery);
    propertyQuery.status = "inactive";
  }
  if (propertyType === "House") {
    let house = await House.findByIdAndUpdate(
      req.params.id,
      {
        $set: propertyQuery,
      },
      {
        new: true,
      }
    );

    if (!house) {
      res
        .status(404)
        .send({ success: false, message: "House not found with this id " });
      return;
    }
    property = house;
  } else if (propertyType === "Car") {
    let car = await Car.findByIdAndUpdate(
      req.params.id,
      {
        $set: propertyQuery,
      },
      {
        new: true,
      }
    );

    if (!car) {
      res
        .status(404)
        .send({ success: false, message: "car not found with this id " });
      return;
    }
    property = car;
  }

  res.send({
    success: true,
    body: _.omit(property.toJSON(), ["__v"]),
  });
});

//if quantity should be posted
//POST api/active-posts/list
router.post("/list", guard, async (req, res) => {
  const error = validateUpdateQuantity(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  let property = null;
  let propertyType = req.body.propertyType;
  if (propertyType === "House") {
    let house = await House.findById(req.params.houseId);
    if (!house)
      return res
        .status(404)
        .send({ success: false, message: "House not found with this id " });
    house.quantity = req.body.quantity;
    house.status = "active";
    property = house;
  } else if (propertyType === "Car") {
    let car = await House.findById(req.params.houseId);
    if (!car)
      return res
        .status(404)
        .send({ success: false, message: "Car not found with this id " });
    car.quantity = req.body.quantity;
    car.status = "active";
    property = car;
  }

  //creating active post for the
  let post = new Post({
    postType: propertyType,
    propertyCategory: property.category,
    city: property.city,
    status: "active",
  });
  if (req.body.propertyType == "House") {
    post.house = property._id;
    post.subCity = property.subCity;
  }
  if (req.user.userType === "agent") {
    post.verifiedBy = req.user.id;
    post.agent = req.user.id;
    post.isAgentPost = true;
  }
  if (req.user.userType === "renter") {
    post.renter = req.user.id;
  }
  await property.save();
  await post.save();
  res.send({
    success: true,
    body: _.omit(property.toJSON(), ["__v"]),
  });
});

function validateUpdateQuantity(ad) {
  const schema = Joi.object({
    propertyType: Joi.string().min(3).max(40).required(),
    quantity: Joi.number().required(),
    propertyId: Joi.objectId().required(),
  });
  const { error } = schema.validate(ad);
  return error;
}
module.exports = router;
