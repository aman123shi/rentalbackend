const _ = require("lodash");
const express = require("express");
const router = express.Router();
const House = require("../models/house");
const validateHouse = require("../helpers/joi/house-validator");

//GET api/houses
router.get("/", async (req, res) => {
  const houses = await House.find().sort("-_id").select("-__v");
  res.send({ success: true, body: houses });
});

//POST api/houses
router.post("/", async (req, res) => {
  const error = validateHouse(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });

  req.body.owner = req.body.user.id;
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
      "images",
      "location",
      "features",
      "isVerified",
      "status",
      "category",
      "owner",
      "quantity",
    ])
  );
  await house.hashPassword();
  await house.save();
  res.send({
    success: true,
    body: _.omit(house.toJSON(), ["password", "__v"]),
  });
});

//PUT api/houses
router.put("/:id", async (req, res) => {
  const error = validateHouse(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  if (req.body.password) {
    let salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  let house = await House.findByIdAndUpdate(
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

  if (!house) {
    res
      .status(404)
      .send({ success: false, message: "House not found with this id " });
    return;
  }
  res.send({
    success: true,
    body: _.omit(house.toJSON(), ["password", "__v"]),
  });
});

//DELETE api/houses

router.delete("/:id", async (req, res) => {
  let house = await House.deleteOne({
    _id: req.params.id,
  });
  if (!house)
    return res
      .status(404)
      .send({ success: false, message: "House not found with this id " });

  res.send({
    success: true,
    body: _.omit(house.toJSON(), ["password", "__V"]),
  });
});
module.exports = router;
