const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const Renter = require("../models/renter");
const Agent = require("../models/agent");
const Admin = require("../models/admin");

router.post("/renter", async (req, res) => {
  authenticate(req, res, Renter);
});

router.post("/agent", async (req, res) => {
  authenticate(req, res, Agent);
});

router.post("/admin", async (req, res) => {
  authenticate(req, res, Admin);
});

async function authenticate(req, res, User) {
  const error = validate(req.body);

  if (error)
    return res.status(400).send({ success: false, message: error.message });
  console.log(req.body.phone);
  let user = await User.findOne({
    phone: req.body.phone,
  });
  if (!user)
    return res
      .status(400)
      .send({ success: false, message: "Invalid phone or //password" });

  let match = await bcrypt.compare(req.body.password, user.password);

  if (!match)
    return res
      .status(400)
      .send({ success: false, message: "Invalid //phone or password" });
  let token = user.generateAuthToken();
  res.send({
    success: true,
    token: token,
  });
}
function validate(req) {
  const schema = Joi.object({
    phone: Joi.string().required().max(20),
    password: Joi.string().required().min(5).max(255),
  });
  const { error } = schema.validate(req);
  return error;
}
module.exports = router;
