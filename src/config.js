require("dotenv").config();
module.exports = {
  port: 3000,
  dbURI: process.env.DB_URI,
  jwtSecretConsumer: process.env.JWT_SECRET_CONSUMER,
  jwtSecretProducer: process.env.JWT_SECRET_PRODUCER,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
};
