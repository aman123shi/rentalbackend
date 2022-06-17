const _ = require("lodash");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const House = require("../models/house");
const validateObjectId = require("../middlewares/validdateObjectId");
const Renter = require("../models/renter");
const Agent = require("../models/agent");
const Post = require("../models/post");
const validateHouse = require("../helpers/joi/house-validator");
const { upload } = require("../helpers/uploads");
const guard = require("../middlewares/guard");
const adminGuard = require("../middlewares/adminGuard");

//GET api/houses
router.get("/", adminGuard, async (req, res) => {
  let subCity = [],
    cityId,
    query = {};
  if (req.user.userType === "agent") {
    let agent = await Agent.findById(req.user.id);
    cityId = agent._id;
    for (let sc of agent.subCity) subCity.push(sc.name);
    query = { "city.id": cityId, "subCity.name": { $in: subCity } };
  }

  const houses = await House.find(query).sort("-_id").select("-__v");
  res.send({ success: true, body: houses });
});

//POST api/houses
router.post("/", guard, upload.array("images", 4), async (req, res) => {
  const error = validateHouse(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });

  req.body.owner = req.user.id;
  let renter = await Renter.findById(req.user.id);

  let house = new House(
    _.pick(req.body, [
      "headerTitle",
      "description",
      "price",
      "pricingRate",
      "size",
      "city",
      "subCity",
      "prePaidPaymentTerm",
      "location",
      "features",
      "isVerified",
      "status",
      "category",
      "owner",
      "quantity",
    ])
  );
  for (let image of req.files) house.images.push("images/" + image.filename);

  await house.save();
  renter.property.push({ propertyType: "House", id: house._id });
  await renter.save();
  //creating pending post for the agent to verify
  let post = new Post({
    postType: "House",
    house: house._id,
    propertyCategory: house.category,
    city: house.city,
    renter: renter._id,
    subCity: house.subCity,
  });
  await post.save();
  res.send({
    success: true,
    body: _.omit(house.toJSON(), ["__v"]),
  });
});

//PUT api/houses
router.put("/:id", async (req, res) => {
  const error = validateHouse(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }

  let house = await House.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, [
        "headerTitle",
        "description",
        "price",
        "pricingRate",
        "size",
        "city",
        "subCity",
        "prePaidPaymentTerm",
        "location",
        "features",
        "isVerified",
        "status",
        "category",
        "owner",
        "quantity",
      ]),
    },
    {
      new: true,
    }
  );

  if (!house) {
    res
      .status(404)
      .send({ success: false, message: "House not found with this id " });
    return;
  }
  res.send({
    success: true,
    body: _.omit(house.toJSON(), ["__v"]),
  });
});

//DELETE api/houses

router.post("/delete/:houseId", async (req, res) => {
  let house = await House.findByIdAndRemove(req.params.houseId);
  if (!house)
    return res
      .status(404)
      .send({ success: false, message: "House not found with this id " });
  //Delete images from a file
  try {
    //getting every images of the house from collection and delete it from a file storage
    for (let imagePath of house.images)
      fs.unlink("./public/" + imagePath, (err) => {
        if (err) throw err;
      });
  } catch (err) {
    if (err && err.code == "ENOENT") {
      console.info("File doesn't exist, won't remove it.");
      return res.send({ success: false, message: "sorry can't find file" });
    } else if (err) {
      console.error("Error occurred while trying to remove file");
      return res.send({ success: false, message: err.message });
    } else {
      console.info(`removed`);
    }
  }
  //removing from active post if present
  if (house.status == "active")
    await Post.findOneAndDelete({ property: req.params.houseId });

  //removing property from the renter collection

  let renter = await Renter.updateOne(
    { _id: req.body.renterId },
    {
      $pull: {
        property: { id: req.body.houseId },
      },
    }
  );
  if (!renter)
    return res.send({ success: false, message: "sorry can't find renter" });

  res.send({
    success: true,
  });
});
module.exports = router;
