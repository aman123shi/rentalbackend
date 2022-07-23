const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  let token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("Access Denied:token should be provided");
  try {
    let decode = jwt.verify(token, process.env.Ethio_Rental_Private_Key);
    req.user = decode;

    if (!(req.user.userType && req.user.userType == "admin"))
      return res.status(401).send("Access Denied: insufficient privilege");

    next();
  } catch (error) {
    return res.status(401).send("Access Denied:token Invalid");
  }
};
