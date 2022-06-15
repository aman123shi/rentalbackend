const express = require("express");
const app = express();
const cors = require("cors");
const config = require("config");
const mongoose = require("mongoose");

//middleware
const guard = require("./middlewares/guard");

//routes
const agents = require("./routes/agents");
const cities = require("./routes/cities");
const houses = require("./routes/houses");
const renters = require("./routes/renters");

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
app.use(express.static("public"));
if (!config.get("jwtPrivateKey")) {
  console.log(
    "FATAL ERROR: jwtPrivatekey not defined in environmental variable == ",
    config.get("jwtPrivateKey")
  );
  process.exit(1);
}
//mapping routes
app.use("/api/agents", agents);
app.use("/api/cities", cities);
app.use("/api/renters", renters);
app.use("/api/houses", houses);

console.log(config.get("jwtPrivateKey") + " == privatekey for jwt");
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}.............`)
);
//cities
