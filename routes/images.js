const fs = require("fs");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

//DELETE api/carCategory

router.delete("/:id", superAdminGuard, async (req, res) => {
  let carCategory = await CarCategory.deleteOne({
    _id: req.params.id,
  });
  if (!carCategory)
    return res.status(404).send({
      success: false,
      message: "carCategory not found with this id ",
    });

  res.send({ success: true, body: _.omit(carCategory, ["__v"]) });
});
module.exports = router;
