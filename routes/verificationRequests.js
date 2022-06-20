const _ = require("lodash");
const express = require("express");
const router = express.Router();
const Agent = require("../models/agent");
const bcrypt = require("bcrypt");
const agentValidator = require("../helpers/joi/v");

//GET api/agents
router.get("/", async (req, res) => {
  const users = await Agent.find().sort("-_id").select("-password -__v");
  res.send({ success: true, body: users });
});

//POST api/agents
router.post("/", async (req, res) => {
  const error = agentValidator(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let agent = await Agent.findOne({
    phone: req.body.phone,
  });
  if (agent) {
    return res
      .status(400)
      .send({ success: false, message: "User already exist" });
  }
  agent = new Agent(
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
  await agent.hashPassword();
  await agent.save();

  let token = await agent.generateAuthToken();

  res.send({
    success: true,
    body: _.omit(agent.toJSON(), ["password", "__v"]),
    token,
  });
});

//PUT api/agents
router.put("/:id", async (req, res) => {
  const error = agentValidator(req.body);
  if (error) {
    res.status(400).send({ success: false, message: error.message });
    return;
  }
  if (req.body.password) {
    let salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  let agent = await Agent.findByIdAndUpdate(
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

  if (!agent) {
    res
      .status(404)
      .send({ success: false, message: "Agent not found with this id " });
    return;
  }
  res.send({
    success: true,
    body: _.omit(agent.toJSON(), ["password", "__v"]),
  });
});

//DELETE api/agents

router.delete("/:id", async (req, res) => {
  let agent = await Agent.deleteOne({
    _id: req.params.id,
  });
  if (!agent)
    return res
      .status(404)
      .send({ success: false, message: "Agent not found with this id " });

  res.send({
    success: true,
    body: _.omit(agent.toJSON(), ["password", "__V"]),
  });
});
module.exports = router;
