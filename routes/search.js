const _ = require("lodash");
const express = require("express");
const router = express.Router();
const House = require("../models/house");
const Car = require("../models/car");
const Post = require("../models/post");
const validateCriteria = require("../helpers/joi/search-criteria-validator");
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

//GET api/search/houses/by-criteria
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

module.exports = router;
