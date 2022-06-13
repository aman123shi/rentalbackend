const _ = require("lodash");
const express = require("express");
const router = express.Router();
const Agent = require("../models/agent");
const agentValidator = require("../helpers/joi/agent-validator");
router.get("/", async (req, res) => {
  const users = await Agent.find().sort("-_id");
  res.send({ success: true, body: users });
});
router.post("/", async (req, res) => {
  const error = validateUser(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let user = await Agent.findOne({
    email: req.body.email,
  });
  if (user) return res.status(400).send("User already exist");
  user = new Agent(_.pick(req.body, ["name", "email", "password"]));
  await user.hashPassword();
  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
