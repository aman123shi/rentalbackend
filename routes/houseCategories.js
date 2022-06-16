const _ = require("lodash");
const express = require("express");
const router = express.Router();
const HouseCategory = require("../models/houseCategory");
const validateHouseCategory = require("../helpers/joi/house-category-validator");
const superAdminGuard = require("../middlewares/super-admin-guard");

//GET api/houseCategory
router.get("/", async (req, res) => {
  const houseCategory = await HouseCategory.find().sort("-_id");
  res.send({ success: true, body: houseCategory });
});

//POST api/houseCategory
router.post("/", superAdminGuard, async (req, res) => {
  const error = validateHouseCategory(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let houseCategory = await HouseCategory.findOne({
    name: req.body.name,
  });
  if (houseCategory) {
    return res
      .status(400)
      .send({ success: false, message: "houseCategory already exist" });
  }
  let newHouseCategory = new HouseCategory(
    _.pick(req.body, ["name", "bedrooms", "bathrooms"])
  );

  await newHouseCategory.save();
  res.send({ success: true, body: _.omit(newHouseCategory, ["__v"]) });
});

//PUT api/houseCategory
router.put("/:id", superAdminGuard, async (req, res) => {
  const error = validateHouseCategory(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  let houseCategory = await HouseCategory.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, ["name", "bathrooms", "bedrooms"]),
    },
    {
      new: true,
    }
  );
  if (!houseCategory) {
    res.status(404).send({
      success: false,
      message: "houseCategory not found with this id ",
    });
    return;
  }

  houseCategory.save();
  res.send({ success: true, body: _.omit(houseCategory, ["-_v"]) });
});

//DELETE api/houseCategory

router.delete("/:id", superAdminGuard, async (req, res) => {
  let houseCategory = await HouseCategory.deleteOne({
    _id: req.params.id,
  });
  if (!houseCategory)
    return res.status(404).send({
      success: false,
      message: "houseCategory not found with this id ",
    });

  res.send({ success: true, body: _.omit(houseCategory, ["__v"]) });
});
module.exports = router;
