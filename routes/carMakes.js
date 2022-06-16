const _ = require("lodash");
const express = require("express");
const router = express.Router();
const CarMake = require("../models/carMake");
const validateCarMake = require("../helpers/joi/car-make-validator");
const superAdminGuard = require("../middlewares/super-admin-guard");

//GET api/carmakes
router.get("/", async (req, res) => {
  const carmakes = await CarMake.find().sort("-_id");
  res.send({ success: true, body: carmakes });
});

//POST api/carmakes
router.post("/", superAdminGuard, async (req, res) => {
  const error = validateCarMake(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let carmakes = await CarMake.findOne({
    name: req.body.name,
  });
  if (carmakes) {
    return res
      .status(400)
      .send({ success: false, message: "carmakes already exist" });
  }
  let newCarMake = new CarMake(_.pick(req.body, ["name"]));

  await newCarMake.save();
  res.send({ success: true, body: _.omit(newCarMake, ["__v"]) });
});

//PUT api/carmakes
router.put("/:id", superAdminGuard, async (req, res) => {
  const error = validateCarMake(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  let carmakes = await CarMake.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, ["name"]),
    },
    {
      new: true,
    }
  );
  if (!carmakes) {
    res.status(404).send({
      success: false,
      message: "carmakes not found with this id ",
    });
    return;
  }

  res.send({ success: true, body: _.omit(carmakes, ["-_v"]) });
});

//DELETE api/carmakes

router.delete("/:id", superAdminGuard, async (req, res) => {
  let carmakes = await CarMake.deleteOne({
    _id: req.params.id,
  });
  if (!carmakes)
    return res.status(404).send({
      success: false,
      message: "carmakes not found with this id ",
    });

  res.send({ success: true, body: _.omit(carmakes, ["__v"]) });
});
module.exports = router;
