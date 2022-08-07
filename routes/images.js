const _ = require("lodash");
const express = require("express");
const router = express.Router();
const deleteImages = require("../helpers/images-helper");
const House = require("../models/house");
const Car = require("../models/car");
const imageDataValidator = require("../helpers/joi/manage-image-validator");
const adminGuard = require("../middlewares/adminGuard");
const upload = require("../helpers/uploads").upload;

//POST api/images/add-image/:propertyid
router.post(
  "/add-image/:propertyid",
  adminGuard,
  upload.array("images", 4),
  async (req, res) => {
    const error = imageDataValidator(req.body);
    let property = null,
      images = [];
    if (error) {
      res.status(400).send({ success: false, message: error.message });
      return;
    }
    for (let image of req.files) images.push("images/" + image.filename);
    if (req.body.propertyType == "House") {
      let house = await House.updateOne(
        {
          _id: req.params.propertyid,
        },
        {
          $push: {
            images: { $each: images },
          },
        }
      );
      if (!house)
        return res.status(404).send({
          success: false,
          message: "can not add image with this id ",
        });

      return res.send({ success: true, body: _.omit(house, ["__v"]) });
    } else if (req.body.propertyType == "Car") {
      let car = await Car.updateOne(
        {
          _id: req.params.propertyid,
        },
        {
          $push: {
            images: { $each: images },
          },
        }
      );
      if (!car)
        return res.status(404).send({
          success: false,
          message: "can not add image with this id ",
        });

      return res.send({ success: true, body: _.omit(car, ["__v"]) });
    }
  }
);
//PUT api/images/delete-image/:propertyid
router.put("/delete-image/:propertyid", adminGuard, async (req, res) => {
  //renterGuard required

  // {propertyType,imagePath}
  const error = imageDataValidator(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  let result = await deleteImages([req.body.imagePath]);
  if (!result.success) return res.status(400).send(result);

  if (req.body.propertyType == "House") {
    let house = await House.updateOne(
      {
        _id: req.params.propertyid,
      },
      {
        $pull: {
          images: req.body.imagePath,
        },
      }
    );
    if (!house)
      return res.status(404).send({
        success: false,
        message: "image not found with this id ",
      });

    return res.send({ success: true, body: _.omit(house, ["__v"]) });
  } else if (req.body.propertyType == "Car") {
    let car = await Car.updateOne(
      {
        _id: req.params.propertyid,
      },
      {
        $pull: {
          images: req.body.imagePath,
        },
      }
    );
    if (!car)
      return res.status(404).send({
        success: false,
        message: "image not found with this id ",
      });

    return res.send({ success: true, body: _.omit(car, ["__v"]) });
  }
});
module.exports = router;
