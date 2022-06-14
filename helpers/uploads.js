const multer = require("multer");
const path = require("path");
const storageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({ storage: storageEngine });
module.exports = upload;
