const crypto = require("crypto");
const OTP_Generator = require("otp-generator");
const accountSid = process.env.Twilio_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.Twilio_Auth_Token; // Your Auth Token from www.twilio.com/console

const client = require("twilio")(accountSid, authToken, {
  lazyLoading: true,
});
async function sendOtp(otp, phone) {
  return client.messages.create({
    body: otp,
    to: phone, // Text this number
    from: "+19893651747", // From a valid Twilio number
  });
}

async function generateOTP() {
  const otp = OTP_Generator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
}
async function signOtpToken(otp, phone, minute) {
  let durationOfValidity = minute * 60 * 1000; //depends on minutes provided
  let expires = Date.now() + durationOfValidity;
  let data = `${phone}.${otp}.${expires}`;
  let hash = crypto
    .createHmac("sha256", process.env.Ethio_Rental_Private_Key)
    .update(data)
    .digest("hex");
  return `${hash}.${expires}`;
}
module.exports = { sendOtp, generateOTP, signOtpToken };
