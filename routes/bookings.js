const _ = require("lodash");
const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Renter = require("../models/renter");
const Car = require("../models/car");
const validateObjectId = require("../middlewares/validateObjectId");
const Agent = require("../models/agent");
const validateBooking = require("../helpers/joi/create-booking-validator");
const Booking = require("../models/booking");
const guard = require("../middlewares/guard");
const adminGuard = require("../middlewares/adminGuard");
const House = require("../models/house");

//GET api/bookings
router.get("/", adminGuard, async (req, res) => {
  let subCity,
    cityId,
    status = req.query.status,
    pageNumber = 1,
    limit = 10,
    query = {};

  if (status) query.status = status;
  const bookings = await Booking.find(query)
    .sort("createdAt")
    .select("-__v")
    .skip((pageNumber - 1) * limit) //pagination
    .limit(limit); // items per page
  res.send({ success: true, body: bookings });
});

//POST api/bookings

router.post("/", adminGuard, async (req, res) => {
  let property,
    query = {},
    findPostQuery = {};
  const error = validateBooking(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  let propertyId = req.body.property;
  if (req.body.propertyType == "House") {
    property = await House.findById(propertyId);
    query.house = propertyId;
    query.propertyCity = property.city;
    query.subCity = property.subCity;
    findPostQuery.house = propertyId;
  } else {
    property = await Car.findById(propertyId);
    query.car = propertyId;
    query.propertyCity = property.city;
    findPostQuery.car = propertyId;
  }
  if (!property)
    return res
      .status(400)
      .send({ success: false, message: "can't find the property" });

  let tenant = await Renter.findById(req.user.id);
  let renter = await Renter.findById(property.owner);
  if (Number.parseFloat(tenant.balance) < Number.parseFloat(property.price)) {
    return res.send({
      success: false,
      message: "insufficient balance please re-charge",
    });
  }
  // subtract balance from tenant account
  tenant.balance -= property.price;
  //assign other properties to fields

  query.propertyType = req.body.propertyType;
  query.renter = renter._id;
  query.tenant = req.user.id;
  query.amount = property.price;
  query.status = "pending";
  query.paymentStatus = "payed";

  let booking = new Booking(query);
  await booking.save();
  //removing from active listing
  await Post.findOneAndUpdate(findPostQuery, { status: "inactive" });
  return res.send({ success: true, body: booking });
});

//PUT api/bookings/cancel/:id
router.put("/cancel/:id", validateObjectId, async (req, res) => {
  let booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.id, status: "pending" },
    { status: "canceled", updatedAt: Date.now() },
    { new: true }
  );
  if (!booking) return sendMessage(false, "can't find booking");
  //returning back tenant money
  let tenant = Renter.findById(booking.tenant);
  tenant.balance += booking.price; //returning back tenant money
  let findPostQuery = {};
  if (booking.propertyType == "House") findPostQuery.house = booking.house;
  else findPostQuery.car = booking.car;

  //listing back to active listing
  await Post.findOneAndUpdate(findPostQuery, { status: "active" });
  return res.send({ success: true, body: booking });
});

//PUT api/bookings/confirm/:id
router.put("/confirm/:id", validateObjectId, async (req, res) => {
  function sendMessage(suc, msg) {
    return res.status(200).send({ success: suc, message: msg });
  }
  let booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.id },
    { status: "confirmed", updatedAt: Date.now() },
    { new: true }
  );
  if (!booking) return sendMessage(false, "can't find booking");
  //add payment to renter balance
  let renter = Renter.findById(booking.renter);
  renter.balance += booking.price - booking.price * 0.05; //cut 5% commission

  if (booking.propertyType == "House") {
    //delete the post
    await Post.findOneAndDelete({ house: booking.house });
    //change property status to inactive
    await House.findOneAndUpdate(
      { _id: booking.house },
      { status: "inactive" }
    );
  } else {
    //delete the post from active listing
    await Post.findOneAndDelete({ car: booking.car });
    //change property status to inactive
    await Car.findOneAndUpdate({ _id: booking.car }, { status: "inactive" });
  }
});
module.exports = router;
