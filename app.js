const express = require("express");
const app = express();
const cors = require("cors");
const config = require("config");
const mongoose = require("mongoose");

const Admin = require("./models/admin");
let DB_URL = config.get("db");
if (app.get("env") === "production") {
  DB_URL = config.get("db-production");
}
mongoose
  .connect(DB_URL)
  .then(() => console.log(`Database connected successfully ${DB_URL}`))
  .catch((err) => console.log("Failed to connect", err));
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
if (!config.get("jwtPrivateKey")) {
  console.log(
    "FATAL ERROR: jwtPrivatekey not defined in environmental variable == ",
    config.get("jwtPrivateKey")
  );
  process.exit(1);
}
console.log(config.get("jwtPrivateKey") + " == privatekey for jwt");
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}.............`)
);
dbTest();
module.exports = server;
async function dbTest() {
  let admin = new Admin({
    firstName: "Bethlehem",
    lastName: "Taye",
    email: "bethy@gmail.com",
    phone: "09314354234",
    password: "1234",
  });
  await admin.save();
}
