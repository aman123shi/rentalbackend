//every six hour cron
//=>    0 */6 * * *
const schedule = require("node-schedule");
const Post = require("../models/post");
const House = require("../models/house");
const Car = require("../models/car");
const sevenDays = 7 * 24 * 60 * 60 * 1000; //7 days 24 hours 60 minutes 60 seconds 1000 milliseconds

const job_inactive_old_posts = schedule.scheduleJob(
  "0 */3 * * *",
  async function () {
    //every three hour
    let lessThan7days = Date.now() - sevenDays,
      houseIds = [],
      carIds = [];
    let posts = await Post.find({ updatedAt: { $lt: lessThan7days } }).select(
      "postType house car"
    );
    for (let post of posts) {
      if (post.postType == "House") houseIds.push(post.house);
      else carIds.push(post.car);
    }
    if (houseIds.length > 0)
      await House.updateMany(
        { _id: { $in: houseIds } },
        { $set: { status: "inactive" } }
      );
    if (carIds.length > 0)
      await Car.updateMany(
        { _id: { $in: carIds } },
        { $set: { status: "inactive" } }
      );

    //delete the posts
    await Post.deleteMany({ updatedAt: { $lt: lessThan7days } });
  }
);
const job_payment_confirmation_deadline = schedule.scheduleJob(
  " */25 * * * *", //check every 25 minute
  async function () {
    //TODO:
    //check if payment deadline is passed and cut penalty and
    //return back balance to renter
  }
);
