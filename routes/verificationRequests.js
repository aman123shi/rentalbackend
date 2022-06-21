const _ = require("lodash");
const express = require("express");
const router = express.Router();
const VerificationRequest = require("../models/verificationRequest");
const bcrypt = require("bcrypt");
const verificationValidator = require("../helpers/joi/verificatio-req-validator");
const adminGuard = require("../middlewares/adminGuard");
const guard = require("../middlewares/guard");
//GET api/verification-requests
router.get("/", adminGuard, async (req, res) => {
  const requests = await VerificationRequest.find({ status: "pending" })
    .sort("-_id")
    .select("-__v");
  res.send({ success: true, body: requests });
});

//POST api/verification-requests
router.post("/", guard, async (req, res) => {
  const error = verificationValidator(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  req.body.renter = req.user.id;
  req.body.paymentStatus = "unpaid";
  let request = new VerificationRequest(
    _.pick(req.body, [
      "properties",
      "renter",
      "description",
      "city",
      "subCity",
      "companyType",
    ])
  );
  await request.save();

  res.send({
    success: true,
    body: _.omit(request.toJSON(), ["__v"]),
  });
});

//PUT api/verification-requests
router.put("/:id", adminGuard, async (req, res) => {
  const error = verificationValidator(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }

  let request = await VerificationRequest.findByIdAndUpdate(
    req.params.id,
    {
      $set: _.pick(req.body, [
        "properties",
        "renter",
        "description",
        "city",
        "subCity",
        "companyType",
      ]),
    },
    {
      new: true,
    }
  );

  if (!request) {
    res.status(404).send({
      success: false,
      message: "verification request not found with this id ",
    });
    return;
  }
  res.send({
    success: true,
    body: _.omit(request.toJSON(), ["__v"]),
  });
});

//DELETE api/verification-requests

router.delete("/:id", adminGuard, async (req, res) => {
  let request = await VerificationRequest.deleteOne({
    _id: req.params.id,
    e,
  });
  if (!request)
    return res.status(404).send({
      success: false,
      message: "verification request not found with this id ",
    });

  res.send({
    success: true,
    body: _.omit(request.toJSON(), ["__V"]),
  });
});
module.exports = router;
