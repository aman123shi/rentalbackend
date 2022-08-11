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
const jwt = require("jsonwebtoken");
const axios = require("axios").default;
const axiosRetry = require("axios-retry");
const { query } = require("express");
let CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
let config = {
  headers: {
    Authorization: "Bearer " + CHAPA_SECRET_KEY,
  },
};
axiosRetry(axios, {
  retries: 10,
  retryDelay: (retryCount) => {
    return 500;
  },
});
//GET api/bookings
router.get("/", adminGuard, async (req, res) => {
  let subCity,
    cityId,
    status = req.query.status,
    pageNumber = req.query.pageNumber || 1,
    limit = req.query.limit || 10,
    tenantId = req.query.tenantId,
    query = {};

  if (status) query.status = status;
  if (tenantId) query.tenant = tenantId;
  const bookings = await Booking.find(query)
    .sort("createdAt")
    .select("-__v")
    .skip((pageNumber - 1) * limit) //pagination
    .limit(limit); // items per page
  res.send({ success: true, body: bookings });
});
//POST api/bookings/init
router.post("/init", guard, async (req, res) => {
  let property = null;
  let tenantId = req.user.id;

  const error = validateBooking(req.body);

  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }

  let tenant = await Renter.findById(tenantId);

  let propertyId = req.body.property;
  let propertyType = req.body.propertyType;
  if (req.body.propertyType == "House") {
    property = await House.findById(propertyId);
  } else {
    property = await Car.findById(propertyId);
  }

  if (!property)
    return res
      .status(400)
      .send({ success: false, message: "can't find the property" });

  let data = {
    tenantId,
    propertyType,
    propertyId: property._id,
    price: property.price,
    date: Date.now(),
  };

  let tx_ref = jwt.sign(data, process.env.Ethio_Rental_Private_Key).toString();
  //tx_ref = "aaaaaa" + Date.now();
  console.log(tx_ref);
  try {
    let customization = {};
    let result = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: property.price,
        currency: "ETB",
        email: "user@mail.com",
        first_name: tenant.firstName,
        last_name: tenant.lastName,
        tx_ref: tx_ref,
        //localhost should be changed in deployment or Integration
        callback_url:
          "http://localhost:3000/api/bookings/success?tx_ref=" + tx_ref,
      },
      config
    );

    //console.log(result.data);

    //returning back the checkout url to Frontend

    res.send(result.data);
  } catch (error) {
    console.log(error);
    res.send("error message " + error);
  }
  //
});

//POST api/bookings/success

router.get("/success", async (req, res) => {
  let property,
    query = {},
    findPostQuery = {};
  const payload = req.query.tx_ref;
  console.log("decoded token");
  console.log(jwt.verify(payload, process.env.Ethio_Rental_Private_Key));
  let transactionData = jwt.verify(
    payload,
    process.env.Ethio_Rental_Private_Key
  );

  let propertyId = transactionData.propertyId;
  if (transactionData.propertyType == "House") {
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
    return res.status(400).send({
      success: false,
      message: "Internal Server error can't find the property",
    });

  let tenant = await Renter.findById(transactionData.tenantId);
  let renter = await Renter.findById(property.owner);

  if (
    Number.parseFloat(transactionData.price) < Number.parseFloat(property.price)
  ) {
    return res.send({
      success: false,
      message: "insufficient balance please re-charge",
    });
  }

  //assign other properties to fields

  query.propertyType = transactionData.propertyType;
  query.renter = renter._id;
  query.tenant = transactionData.tenantId;
  query.renterPhone = renter.phone;
  query.tenantPhone = tenant.phone;
  query.amount = property.price;
  query.status = "pending"; //pending,canceled,confirmed
  query.paymentStatus = "payed";

  let booking = new Booking(query);
  await booking.save();
  //removing from active listing
  await Post.findOneAndUpdate(findPostQuery, { status: "inactive" });
  res.send(
    '<h3 style="color:green">Payment successful go to my-booking for more Info </h3>'
  );
  //return res.send({ success: true, body: booking });
});

//PUT api/bookings/cancel/:id
router.put("/cancel/:id", validateObjectId, async (req, res) => {
  let booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.id, status: "pending" },
    { status: "canceled" },
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
    { status: "confirmed" },
    { new: true }
  );
  if (!booking) return sendMessage(false, "can't find booking");
  //add payment to renter balance
  let renter = Renter.findById(booking.renter);
  renter.balance += booking.price - booking.price * 0.02; //cut 2% commission

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
