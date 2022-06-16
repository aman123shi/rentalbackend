const _ = require("lodash");
const express = require("express");
const router = express.Router();
const Ad = require("../models/advertisment");
const bcrypt = require("bcrypt");
const adValidator = require("../helpers/joi/ad-validator");
const superAdminGuard = require("../middlewares/super-admin-guard");
const { uploadAd } = require("../helpers/uploads");
//GET api/ads
router.get("/", async (req, res) => {
  const ads = await Ad.find().sort("-_id").select("-__v");
  res.send({ success: true, body: ads });
});

//POST api/ads
router.post("/", async (req, res) => {
  const error = adValidator(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let ad = await Ad.findOne({
    phone: req.body.phone,
  });
  if (ad) {
    return res
      .status(400)
      .send({ success: false, message: "User already exist" });
  }
  ad = new Ad(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "phone",
      "password",
      "city",
      "subCity",
      "privilege",
    ])
  );
  await ad.hashPassword();
  await ad.save();

  let token = await ad.generateAuthToken();

  res.send({
    success: true,
    body: _.omit(ad.toJSON(), ["password", "__v"]),
    token,
  });
});

//PUT api/ads
router.put("/:id", async (req, res) => {
  const error = adValidator(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  if (req.body.password) {
    let salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  let ad = await Ad.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "city",
        "subCity",
        "privilege",
      ]),
    },
    {
      new: true,
    }
  );

  if (!ad) {
    res
      .status(404)
      .send({ success: false, message: "Ad not found with this id " });
    return;
  }
  res.send({
    success: true,
    body: _.omit(ad.toJSON(), ["password", "__v"]),
  });
});

//DELETE api/ads

router.delete("/:id", async (req, res) => {
  let ad = await Ad.deleteOne({
    _id: req.params.id,
  });
  if (!ad)
    return res
      .status(404)
      .send({ success: false, message: "Ad not found with this id " });

  res.send({
    success: true,
    body: _.omit(ad.toJSON(), ["password", "__V"]),
  });
});
module.exports = router;
