const _ = require("lodash");
const express = require("express");
const router = express.Router();
const CarCategory = require("../models/carCategory");
const validateCarCategory = require("../helpers/joi/car-category-validator");
const superAdminGuard = require("../middlewares/super-admin-guard");

//GET api/carCategory
router.get("/", async (req, res) => {
  const carCategory = await CarCategory.find().sort("-_id");
  res.send({ success: true, body: carCategory });
});

//POST api/carCategory
router.post("/", superAdminGuard, async (req, res) => {
  const error = validateCarCategory(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let carCategory = await CarCategory.findOne({
    name: req.body.name,
  });
  if (carCategory) {
    return res
      .status(400)
      .send({ success: false, message: "carCategory already exist" });
  }
  let newCarCategory = new CarCategory(_.pick(req.body, ["name"]));

  await newCarCategory.save();
  res.send({ success: true, body: _.omit(newCarCategory, ["__v"]) });
});

//PUT api/carCategory
router.put("/:id", superAdminGuard, async (req, res) => {
  const error = validateCarCategory(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  let carCategory = await CarCategory.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, ["name"]),
    },
    {
      new: true,
    }
  );
  if (!carCategory) {
    res.status(404).send({
      success: false,
      message: "carCategory not found with this id ",
    });
    return;
  }

  res.send({ success: true, body: _.omit(carCategory, ["-_v"]) });
});

//DELETE api/carCategory

router.delete("/:id", superAdminGuard, async (req, res) => {
  let carCategory = await CarCategory.deleteOne({
    _id: req.params.id,
  });
  if (!carCategory)
    return res.status(404).send({
      success: false,
      message: "carCategory not found with this id ",
    });

  res.send({ success: true, body: _.omit(carCategory, ["__v"]) });
});
module.exports = router;
