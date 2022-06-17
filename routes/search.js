const _ = require("lodash");
const express = require("express");
const router = express.Router();
const House = require("../models/house");
const Car = require("../models/car");
const Post = require("../models/post");
const validateCity = require("../helpers/joi/city-validator");
//public searches

//GET api/search/houses/:category
router.get("/houses/:category", async (req, res) => {
  let category = req.params.category;
  let query = {
    propertyType: "House",
    propertyCategory: category,
    status: "pending",
  };
  if (req.query.city) query.city = req.query.city;
  let houses = await Post.find(query)
    .sort("createdAt")
    .populate("house")
    .select("house");
  houses = houses.map((h) => h.house);
  res.send({ success: true, body: houses });
});

module.exports = router;
