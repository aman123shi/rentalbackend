const _ = require("lodash");
const express = require("express");
const router = express.Router();
const Renter = require("../models/renter");
const bcrypt = require("bcrypt");
const renterValidator = require("../helpers/joi/renter-validator");
const guard = require("../middlewares/guard");
const adminGuard = require("../middlewares/adminGuard");
//GET api/renters
//accessed by Agent and Admin
router.get("/", adminGuard, async (req, res) => {
  const renters = await Renter.find().sort("-_id").select("-password -__v");
  res.send({ success: true, body: renters });
});

//POST api/renters
//accessed by renters for registration
router.post("/", async (req, res) => {
  const error = renterValidator(req.body);
  console.log("renter validator ", error);
  console.log("/post called");
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let renter = await Renter.findOne({
    phone: req.body.phone,
  });
  if (renter) {
    return res
      .status(400)
      .send({ success: false, message: "User already exist" });
  }
  renter = new Renter(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "property",
      "phone",
      "password",
      "city",
      "subCity",
      "posts",
    ])
  );
  await renter.hashPassword();
  await renter.save();
  let token = await renter.generateAuthToken();

  res.send({
    success: true,
    body: _.omit(renter.toJSON(), ["password", "__v"]),
    token,
  });
});

//PUT api/renters
//accessed by renters and agents
router.put("/:id", guard, async (req, res) => {
  const error = renterValidator(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  if (req.body.password) {
    let salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  let renter = await Renter.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, [
        "firstName",
        "lastName",
        "property",
        "phone",
        "password",
        "city",
        "subCity",
        "posts",
      ]),
    },
    {
      new: true,
    }
  );

  if (!renter) {
    res
      .status(404)
      .send({ success: false, message: "renter not found with this id " });
    return;
  }
  res.send({
    success: true,
    body: _.omit(renter.toJSON(), ["password", "__v"]),
  });
});

//DELETE api/renters

router.delete("/:id", guard, async (req, res) => {
  let renter = await Renter.deleteOne({
    _id: req.params.id,
  });
  if (!renter)
    return res
      .status(404)
      .send({ success: false, message: "renter not found with this id " });

  res.send({
    success: true,
    body: _.omit(renter.toJSON(), ["password", "__V"]),
  });
});
module.exports = router;
