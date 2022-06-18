const _ = require("lodash");
const express = require("express");
const router = express.Router();
const House = require("../models/house");
const Car = require("../models/car");
const Post = require("../models/post");
const validateCriteria = require("../helpers/joi/search-criteria-validator");
const validateMapCriteria = require("../helpers/joi/search-by-map-validator");

//public searches

//GET api/search/houses/:category
router.get("/houses/:category", async (req, res) => {
  let category = req.params.category,
    pageNumber = 1,
    limit = 10;
  let query = {
    propertyType: "House",
    propertyCategory: category,
    status: "pending",
  };
  if (req.query.city) query.city = req.query.city;
  pageNumber = Number.parseInt(req.query.page || 1);
  limit = Number.parseInt(req.query.limit || 10);
  let houses = await Post.find(query)
    .sort("createdAt")
    .populate("house")
    .select("house")
    .skip((pageNumber - 1) * limit) //pagination
    .limit(limit); // items per page
  houses = houses.filter((h) => h.house !== null).map((h) => h.house);
  res.send({ success: true, body: houses });
});

//POST api/search/houses/by-criteria
router.post("/houses/by-criteria", async (req, res) => {
  const error = validateCriteria(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let pageNumber = 1,
    limit = 10;
  let postQuery = {
    propertyType: "House",
    propertyCategory: req.body.category,
    city: req.body.city,
    status: "pending",
  };
  let populateQuery = {
    price: { $gte: req.body.minPrice, $lte: req.body.maxPrice },
  };
  if (req.body.subCity) postQuery.subCity = req.body.subCity;
  if (req.body.bathroom)
    populateQuery["bathroom"] = { $gte: req.body.bathroom };
  if (req.body.bedroom) populateQuery["bedroom"] = { $gte: req.body.bedroom };

  pageNumber = Number.parseInt(req.query.page || 1);
  limit = Number.parseInt(req.query.limit || 10);
  let houses = await Post.find(postQuery)
    .sort("createdAt")
    .populate({
      path: "house",
      match: populateQuery,
    }) //populate house property in Post
    .select("house") // just select only house field
    .skip((pageNumber - 1) * limit) //pagination
    .limit(limit); // items per page
  houses = houses.filter((h) => h.house !== null).map((h) => h.house);
  res.send({ success: true, body: houses });
});
//search house by-map
//GET api/search/houses/by-map
router.post("/houses/by-map", async (req, res) => {
  const error = validateMapCriteria(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let pageNumber = 1,
    limit = 10;
  let postQuery = {
    propertyType: "House",
    propertyCategory: req.body.category,
    status: "pending",
  };
  let populateQuery = {
    price: { $gte: req.body.minPrice, $lte: req.body.maxPrice },
  };
  if (req.body.bathroom)
    populateQuery["bathroom"] = { $gte: req.body.bathroom };
  if (req.body.bedroom) populateQuery["bedroom"] = { $gte: req.body.bedroom };
  //populating based on given circle shape
  const earths_equatorial_radius_in_meter = 6378100; //in meter
  let longitude = Number.parseFloat(req.body.center.lng);
  let latitude = Number.parseFloat(req.body.center.lat);
  let circleRadius =
    Number.parseFloat(req.body.radius) / earths_equatorial_radius_in_meter; //if radius is meter
  populateQuery.location = {
    $geoWithin: { $centerSphere: [[longitude, latitude], circleRadius] },
  };

  pageNumber = Number.parseInt(req.query.page || 1);
  limit = Number.parseInt(req.query.limit || 10);
  let houses = await Post.find(postQuery)
    .sort("createdAt")
    .populate({
      path: "house",
      match: populateQuery,
    }) //populate house property in Post
    .select("house") // just select only house field
    .skip((pageNumber - 1) * limit) //pagination
    .limit(limit); // items per page
  houses = houses.filter((h) => h.house !== null).map((h) => h.house);
  res.send({ success: true, body: houses });
});

// ****************************************** cars ********************************
//GET api/search/cars/:category
router.get("/cars/:category", async (req, res) => {
  let category = req.params.category,
    pageNumber = 1,
    limit = 10;
  let query = {
    propertyType: "Car",
    propertyCategory: category,
    status: "pending",
  };
  if (req.query.city) query.city = req.query.city;
  pageNumber = Number.parseInt(req.query.page || 1);
  limit = Number.parseInt(req.query.limit || 10);
  let cars = await Post.find(query)
    .sort("createdAt")
    .populate("car")
    .select("car") //select only car field cause we don't need other post properties
    .skip((pageNumber - 1) * limit) //pagination
    .limit(limit); // items per page
  cars = cars.filter((c) => c.car !== null).map((c) => c.car);
  res.send({ success: true, body: cars });
});

//POST api/search/cars/by-criteria
router.post("/cars/by-criteria", async (req, res) => {
  const error = validateCriteria(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let pageNumber = 1,
    limit = 10;
  let postQuery = {
    propertyType: "Car",
    propertyCategory: req.body.category,
    city: req.body.city,
    status: "pending",
  };
  let populateQuery = {
    price: { $gte: req.body.minPrice, $lte: req.body.maxPrice },
  };
  if (req.body.subCity) postQuery.subCity = req.body.subCity;

  pageNumber = Number.parseInt(req.query.page || 1);
  limit = Number.parseInt(req.query.limit || 10);
  let cars = await Post.find(postQuery)
    .sort("createdAt")
    .populate({
      path: "car",
      match: populateQuery,
    }) //populate car property in Post
    .select("car") // just select only house field
    .skip((pageNumber - 1) * limit) //pagination
    .limit(limit); // items per page
  cars = cars.filter((c) => c.car !== null).map((c) => h.car);
  res.send({ success: true, body: cars });
});
module.exports = router;
