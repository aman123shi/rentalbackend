const _ = require("lodash");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const Ad = require("../models/advertisment");
const adValidator = require("../helpers/joi/ad-validator");
const superAdminGuard = require("../middlewares/super-admin-guard");
const deleteImages = require("../helpers/images-helper");
const { uploadAd } = require("../helpers/uploads");
//GET api/ads
router.get("/", async (req, res) => {
  const ads = await Ad.find().sort("-_id").select("-__v");
  res.send({ success: true, body: ads });
});

//POST api/ads
router.post(
  "/",
  superAdminGuard,
  uploadAd.array("images", 2),
  async (req, res) => {
    const error = adValidator(req.body);
    if (error)
      return res.status(400).send({ success: false, message: error.message });

    let ad = new Ad(
      _.pick(req.body, [
        "adType",
        "duration",
        "title",
        "description",
        "postedBy",
        "status",
        "images",
      ])
    );
    for (let image of req.files) ad.images.push("ads/" + image.filename);
    await ad.save();

    res.send({
      success: true,
      body: _.omit(ad.toJSON(), ["__v"]),
    });
  }
);

//PUT api/ads
router.put("/:id", superAdminGuard, async (req, res) => {
  const error = adValidator(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }

  let ad = await Ad.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, [
        "adType",
        "duration",
        "title",
        "description",
        "postedBy",
        "status",
        "images",
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
    body: _.omit(ad.toJSON(), ["__v"]),
  });
});

//DELETE api/ads

router.delete("/:id", superAdminGuard, async (req, res) => {
  let ad = await Ad.findByIdAndRemove(req.params.id);
  if (!ad)
    return res
      .status(404)
      .send({ success: false, message: "Ad not found with this id " });

  //Delete images from a file
  let result = await deleteImages(ad.images);
  if (!result.success) return res.status(400).send(result);

  res.send({
    success: true,
    body: _.omit(ad.toJSON(), ["__V"]),
  });
});
module.exports = router;
