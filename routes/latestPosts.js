const _ = require("lodash");
const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Car = require("../models/car");
const House = require("../models/house");
// this end point is for renters from mobile UI
//GET api/latest/houses
router.get("/houses", async (req, res) => {
  let subCity = req.query.subCity,
    cityId = req.query.cityId,
    status = req.query.status || "active", //should be changed to active
    page = req.query.page || 1,
    limit = req.query.limit || 10,
    propertyCategory = req.query.propertyCategory,
    housesId = [],
    query = { postType: "House", status };

  if (cityId) query.cityId = cityId;
  if (subCity) query.subCity = subCity;
  if (propertyCategory) query.propertyCategory = propertyCategory;

  const activePosts = await Post.find(query)
    .skip((page - 1) * limit) //pagination
    .limit(limit); // items per page

  const totalRecords = await Post.countDocuments(query);

  for (let house of activePosts) housesId.push(house.house);

  const houses = await House.find({ _id: { $in: housesId } })
    .sort("updatedAt")
    .select("-__v");

  res.send({ success: true, body: houses, totalRecords });
});
//GET api/latest/cars
router.get("/cars", async (req, res) => {
  let subCity = req.query.subCity,
    cityId = req.query.cityId,
    status = req.query.status || "active", //should be changed to active
    page = req.query.page || 1,
    limit = req.query.limit || 10,
    propertyCategory = req.query.propertyCategory,
    carsId = [];
  query = { postType: "Car", status };

  if (cityId) query.cityId = cityId;
  if (subCity) query.subCity = subCity;
  if (propertyCategory) query.propertyCategory = propertyCategory;

  const activePosts = await Post.find(query)
    .skip((page - 1) * limit) //pagination
    .limit(limit); // items per page

  const totalRecords = await Post.countDocuments(query);

  for (let car of activePosts) carsId.push(car.car);

  const cars = await Car.find({ _id: { $in: carsId } })
    .sort("updatedAt")
    .select("-__v");

  res.send({ success: true, body: cars, totalRecords });
});
module.exports = router;
