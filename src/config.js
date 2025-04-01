require("dotenv").config();
module.exports = {
  port: 3000,
  dbURI: process.env.DB_URI || "mongodb://localhost:27017/your_db",
  jwtSecretConsumer: process.env.JWT_SECRET_CONSUMER || "consumerSecretKey",
  jwtSecretProducer: process.env.JWT_SECRET_PRODUCER || "producerSecretKey",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30m",
};
