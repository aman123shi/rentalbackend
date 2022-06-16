const multer = require("multer");
const path = require("path");
function storageEngine(root) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/${root}/`);
    },

    filename: function (req, file, cb) {
      cb(
        null,
        file.originalname.replace(" ", "-") +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  });
}

let upload = multer({ storage: storageEngine("images") });
let uploadAd = multer({ storage: storageEngine("ads") });

module.exports.upload = upload;
module.exports.uploadAd = uploadAd;
