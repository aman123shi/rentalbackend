const express = require("express");
const app = express();
const cors = require("cors");
const config = require("config");
const mongoose = require("mongoose");
const compression = require("compression");
//loading environmental variables
require("dotenv").config();

//middleware
const guard = require("./middlewares/guard");

//importing routes
const agents = require("./routes/agents");
const reports = require("./routes/reports");
const latestPosts = require("./routes/latestPosts");
const cities = require("./routes/cities");
const houses = require("./routes/houses");
const cars = require("./routes/cars");
const ads = require("./routes/ads");
const renters = require("./routes/renters");
const carCategories = require("./routes/carCategories");
const carMakes = require("./routes/carMakes");
const houseCategories = require("./routes/houseCategories");
const search = require("./routes/search");
const bookings = require("./routes/bookings");
const login = require("./routes/login");
const posts = require("./routes/posts");
const activePosts = require("./routes/activePosts");
const images = require("./routes/images");
const auth = require("./routes/signUp");
const verificationRequests = require("./routes/verificationRequests");
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
if (!process.env.Ethio_Rental_Private_Key) {
  console.log(
    "FATAL ERROR: jwtPrivatekey not defined in environmental variable == ",
    process.env.Ethio_Rental_Private_Key
  );
  process.exit(1);
}
app.use(compression());
//mapping routes
app.use("/api/agents", agents);
app.use("/api/cities", cities);
app.use("/api/renters", renters);
app.use("/api/houses", houses);
app.use("/api/cars", cars);
app.use("/api/ads", ads);
app.use("/api/car-categories", carCategories);
app.use("/api/car-makes", carMakes);
app.use("/api/house-categories", houseCategories);
app.use("/api/search", search);
app.use("/api/active-posts", activePosts);
app.use("/api/posts", posts);
app.use("/api/bookings", bookings);
app.use("/api/reports", reports);
app.use("/api/images", images);
app.use("/api/latest", latestPosts);
app.use("/api/verification-requests", verificationRequests);
app.use("/api/login", login);
app.use("/api/auth", auth); //sign-up forget-password

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}.............`)
);
//cities
