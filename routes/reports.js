const _ = require("lodash");
const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Car = require("../models/car");
const House = require("../models/house");

router.get("/new-houses", async (req, res) => {});
router.get("/new-cars", async (req, res) => {});
router.get("/most-posted-house-category", async (req, res) => {});
router.get("/new-renters", async (req, res) => {}); //total renters this month, by city
router.get("/new-payed-bookings", async (req, res) => {});
router.get("/total-pending-bookings", async (req, res) => {});

module.exports = router;
/*
db.collection.aggregate([
  // First Stage: filter out dates
  {
    $match: {
      date: { $gte: new ISODate("2020-01-01"), $lt: new ISODate("2020-12-31") },
    },
  },
  // Second Stage: group by day of the year
  {
    $group: {
      _id: { $dateToString: { format: "%d-%m-%Y", date: "$date" } },
      count: { $sum: 1 },
    },
  },
  // Third Stage, reshape the output documents
  {
    $project: {
      _id: 0,
      date: "$_id",
      count: 1
    },
  },
]);





*/
