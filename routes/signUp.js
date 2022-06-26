const express = require("express");
const router = express.Router();
const Renter = require("../models/renter");
const {
  sendOtp,
  generateOTP,
  signOtpToken,
} = require("../helpers/twilio-otp-helper");

// POST api/auth/sign-up
//send the otp and hash to POST /api/renters
router.post("/sign-up", async (req, res) => {
  const error = req.body.phone === null;
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
  let otp = await generateOTP();
  console.log("generated otp is " + otp);
  try {
    let message = await sendOtp(
      "your Ethio rental Verification code is " + otp,
      req.body.phone
    );
    console.log("message:-", message);
    let hash = await signOtpToken(otp, req.body.phone, 60);
    res.status(200).send({ success: true, hash, phone: req.body.phone });
  } catch (error) {
    if (error)
      return res.send({ success: false, message: "internal server error " });
    console.log(error);
  }
});
// POST api/auth/forget-password
router.post("/forget-password", async (req, res) => {
  const error = req.body.phone === null;
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let renter = await Renter.findOne({
    phone: req.body.phone,
  });
  if (!renter) {
    return res
      .status(400)
      .send({ success: false, message: "User does not exist" });
  }
  let otp = await generateOTP();
  try {
    let message = await sendOtp(
      "your Ethio rental password recovery code is " + otp,
      req.body.phone
    );
    console.log("message:-", message);
    let hash = await signOtpToken(otp, req.body.phone, 60);
    res.status(200).send({ success: true, hash, phone: req.body.phone });
  } catch (error) {
    if (error)
      return res.send({ success: false, message: "internal server error " });
    console.log(error);
  }
});
module.exports = router;
