require("dotenv").config();
const twilio = require("twilio");
const config = require("/Users/Abhiman.Chauhan/Desktop/Project/Backend 2/src/config");

const client = twilio(config.accountSid, config.authToken);

async function sendOTP(phoneNumber) {
  try {
    const verification = await client.verify.v2
      .services(config.verifyServiceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });
    console.log(`OTP sent to ${phoneNumber}: ${verification.status}`);
    return verification.status;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
}

async function verifyOTP(phoneNumber, code) {
  try {
    const verificationCheck = await client.verify.v2
      .services(config.verifyServiceSid)
      .verificationChecks.create({ to: phoneNumber, code: code });
    console.log(
      `OTP verification status for ${phoneNumber}: ${verificationCheck.status}`
    );
    return verificationCheck.status;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}
module.exports = { sendOTP, verifyOTP };
