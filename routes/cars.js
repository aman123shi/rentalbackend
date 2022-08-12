const _ = require("lodash");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const Car = require("../models/car");
const deleteImages = require("../helpers/images-helper");

const Renter = require("../models/renter");
const Post = require("../models/post");
const validateCar = require("../helpers/joi/car-validator");
const { upload } = require("../helpers/uploads");
const guard = require("../middlewares/guard");
const adminGuard = require("../middlewares/adminGuard");

//GET api/cars
router.get("/", adminGuard, async (req, res) => {
  let subCity = [],
    cityId,
    query = {},
    page = req.query.page || 1,
    limit = req.query.limit || 10;

  const totalRecords = await Car.countDocuments(query);
  const cars = await Car.find()
    .sort("-_id")
    .select("-__v")
    .skip((page - 1) * limit) //pagination
    .limit(limit); // items per page
  res.send({ success: true, body: cars, totalRecords });
});

//POST api/cars
router.post("/", guard, upload.array("images", 4), async (req, res) => {
  const error = validateCar(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });

  req.body.owner = req.user.id;
  let renter = await Renter.findById(req.user.id);

  let car = new Car(
    _.pick(req.body, [
      "headerTitle",
      "description",
      "price",
      "pricingRate",
      "make",
      "model",
      "bodyType",
      "city",
      "engineType",
      "transmission",
      "prePaidPaymentTerm",
      "features",
      "isVerified",
      "isApproved",
      "paymentConfirmationDays",
      "status",
      "category",
      "owner",
      "quantity",
    ])
  );
  for (let image of req.files) car.images.push("images/" + image.filename);

  renter.property.push({ propertyType: "Car", id: car._id });
  await renter.save();
  // creating pending post
  let post = new Post({
    postType: "Car",
    car: car._id,
    propertyCategory: car.category,
    city: car.city,
    renter: renter._id,
  });
  if (req.user.userType === "agent") {
    car.agent = req.user.id;
    car.isApproved = true;
    car.isVerified = true;
    post.verifiedBy = req.user.id;
    post.agent = req.user.id;
    post.isAgentPost = true;
    post.status = "active";
  }
  await car.save();
  await post.save();
  res.send({
    success: true,
    body: _.omit(car.toJSON(), ["__v"]),
  });
});

//PUT api/cars
router.put("/:id", async (req, res) => {
  const error = validateCar(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }

  let car = await Car.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, [
        "headerTitle",
        "description",
        "price",
        "pricingRate",
        "size",
        "city",
        "subCity",
        "prePaidPaymentTerm",
        "location",
        "features",
        "status",
        "category",
        "owner",
        "quantity",
      ]),
    },
    {
      new: true,
    }
  );

  if (!car) {
    res
      .status(404)
      .send({ success: false, message: "Car not found with this id " });
    return;
  }
  res.send({
    success: true,
    body: _.omit(car.toJSON(), ["__v"]),
  });
});

//DELETE api/cars/:id

router.post("/delete/:carId", async (req, res) => {
  let car = await Car.findByIdAndRemove(req.params.carId);
  if (!car)
    return res
      .status(404)
      .send({ success: false, message: "car not found with this id " });
  //Delete images from a file
  let result = await deleteImages(car.images);
  if (!result.success) return res.status(400).send(result);

  //removing from active post
  if (car.status == "active")
    await Post.findOneAndDelete({ property: req.params.carId });

  //removing property from the renter collection
  if (req.user.userType == "renter") {
    let renter = await Renter.updateOne(
      { _id: req.body.renterId },
      {
        $pull: {
          property: { id: req.body.carId },
        },
      }
    );
    if (!renter)
      return res.send({ success: false, message: "sorry can't find renter" });
  }
  res.send({
    success: true,
  });
});
module.exports = router;
