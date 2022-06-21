const fs = require("fs");
async function deleteImages(images) {
  try {
    //getting every images of the house from collection and delete it from a file storage
    for (let imagePath of images)
      fs.unlink("./public/" + imagePath, (err) => {
        if (err) throw err;
      });
    return { success: true, message: "images removed!!" };
  } catch (err) {
    if (err && err.code == "ENOENT") {
      console.info("File doesn't exist, won't remove it.");
      return { success: false, message: "sorry can't find file" };
    } else if (err) {
      console.error("Error occurred while trying to remove file");
      return { success: false, message: err.message };
    } else {
      return { success: true, message: "images removed" };
    }
  }
}
module.exports = deleteImages;
