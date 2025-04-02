const jwt = require("jsonwebtoken");
const config = require("/Users/Abhiman.Chauhan/Desktop/Project/Backend 2/src/config");
function generateToken(user) {
  const secret =
    user.role === "producer"
      ? config.jwtSecretProducer
      : config.jwtSecretConsumer;
  const payload = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, secret, { expiresIn: config.jwtExpiresIn });
}

function verifyToken(token, role) {
  const secret =
    role === "producer" ? config.jwtSecretProducer : config.jwtSecretConsumer;
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid or expired token.");
  }
}

module.exports = { generateToken, verifyToken };
