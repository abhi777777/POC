const Ticket = require("./model");
const { verifyToken } = require("../../services/jwt/index");

function getUserFromToken(req) {
  return req.user;
}

// ✅ Improved Authentication Middleware
exports.authenticate = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Token is missing or invalid format." });
  }

  token = token.split(" ")[1]; // Extract actual token after "Bearer"

  try {
    const payload = verifyToken(token, "consumer"); // Dynamically verify user role
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token." });
  }
};

// ✅ Improved Ticket Raising Function
exports.raiseticket = async (req, res, next) => {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated." });
    }

    const ticketData = { ...req.body, createdBy: req.user.id };
    const newTicket = new Ticket(ticketData);
    await newTicket.save();

    res
      .status(201)
      .json({ message: "Ticket raised successfully", ticket: newTicket });
    next();
  } catch (err) {
    console.error("Ticket Creation Error:", err); // Logs for debugging
    res
      .status(500)
      .json({ error: "Something went wrong while creating the ticket." });
  }
};
