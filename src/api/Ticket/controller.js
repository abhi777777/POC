const Ticket = require("./model");
const { verifyToken } = require("../../services/jwt/index");
function getUserFromToken(req) {
  return req.user;
}

exports.authenticate = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token provided." });
  token = token.slice(7).trim();
  try {
    let payload = verifyToken(token, "consumer");
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: " + err.message });
  }
};

exports.raiseticket = async (req, res, next) => {
  try {
    const TicketData = { ...req.body, createdBy: req.user.id };

    const NewTicket = new Ticket(TicketData);
    await NewTicket.save();

    res
      .status(201)
      .json({ message: "Ticket raised successfully", ticket: NewTicket });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};
