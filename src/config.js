require("dotenv").config();
module.exports = {
  port: process.env.PORT || 4000,
  dbURI: process.env.DB_URI || "mongodb://localhost:27017/your_db",
  jwtSecretConsumer: process.env.JWT_SECRET_CONSUMER || "defaultConsumerSecret",
  jwtSecretProducer: process.env.JWT_SECRET_PRODUCER || "defaultProducerSecret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromEmail: process.env.FROM_EMAIL || "noreply@gmail.com",
  },
};
