const _ = require("lodash");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const Car = require("../models/car");
//const validateObjectId = require("../middlewares/validdateObjectId");
const Renter = require("../models/renter");
//const Agent = require("../models/agent");
const validateCar = require("../helpers/joi/car-validator");
const { upload } = require("../helpers/uploads");
const guard = require("../middlewares/guard");
const adminGuard = require("../middlewares/adminGuard");

//GET api/cars
router.get("/", adminGuard, async (req, res) => {
  let subCity = [],
    cityId,
    query = {};
  if (req.user.userType === "agent") {
    for (let p of req.user.privilege) {
      if (p.name == "Car" && p.r == true) {
        let cars = await Car.find(query).sort("-_id").select("-__v");
        return res.send({ success: true, body: cars });
      }
    }
    return res.status(401).send({
      success: false,
      message: "Access denied: you dont have enough privilege",
    });
  }

  const cars = await Car.find().sort("-_id").select("-__v");
  res.send({ success: true, body: cars });
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
      "size",
      "city",
      "subCity",
      "prePaidPaymentTerm",
      "location",
      "features",
      "isVerified",
      "status",
      "category",
      "owner",
      "quantity",
    ])
  );
  for (let image of req.files) car.images.push("images/" + image.filename);

  await car.save();
  renter.property.push({ propertyType: "Car", id: car._id });
  await renter.save();
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

//DELETE api/cars

router.post("/delete/:carId", async (req, res) => {
  let car = await Car.findByIdAndRemove(req.params.carId);
  if (!car)
    return res
      .status(404)
      .send({ success: false, message: "car not found with this id " });
  //Delete images from a file
  try {
    //getting every images of the car from collection and delete it from a file storage
    for (let imagePath of car.images)
      fs.unlink("./public/" + imagePath, (err) => {
        if (err) throw err;
      });
  } catch (err) {
    if (err && err.code == "ENOENT") {
      console.info("File doesn't exist, won't remove it.");
      return res.send({ success: false, message: "sorry can't find file" });
    } else if (err) {
      console.error("Error occurred while trying to remove file");
      return res.send({ success: false, message: err.message });
    } else {
      console.info(`removed`);
    }
  }
  //removing property from the renter collection
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

  res.send({
    success: true,
  });
});
module.exports = router;
