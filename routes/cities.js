const _ = require("lodash");
const express = require("express");
const router = express.Router();
const City = require("../models/city");
const validateCity = require("../helpers/joi/city-validator");

//GET api/cities
router.get("/", async (req, res) => {
  const cities = await City.find().sort("-_id");
  res.send({ success: true, body: cities });
});

//POST api/cities
router.post("/", async (req, res) => {
  const error = validateCity(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let city = await City.findOne({
    name: req.body.name,
  });
  if (city) {
    return res
      .status(400)
      .send({ success: false, message: "city already exist" });
  }
  city = new City({});
  city.name = req.body.name;
  for (let subCity of req.body.subCity) {
    city.subCity.push(subCity);
  }

  await city.save();
  res.send({ success: true, body: _.omit(city, ["password"]) });
});

//PUT api/cities
router.put("/:id", async (req, res) => {
  const error = validateCity(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  let city = await City.findById(req.params.id);
  if (!city) {
    res
      .status(404)
      .send({ success: false, message: "city not found with this id " });
    return;
  }
  city.name = req.body.name;
  city.subCity = req.body.subCity;
  city.save();
  res.send({ success: true, body: _.omit(city, ["-_v"]) });
});

//DELETE api/cities

router.delete("/:id", async (req, res) => {
  let city = await City.deleteOne({
    _id: req.params.id,
  });
  if (!city)
    return res
      .status(404)
      .send({ success: false, message: "city not found with this id " });

  res.send({ success: true, body: _.omit(city, ["password"]) });
});
module.exports = router;
