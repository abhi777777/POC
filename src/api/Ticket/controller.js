const { Ticket, PendingTicket } = require("./model");
const { verifyToken } = require("../../services/jwt/index");
const { sendOTP } = require("../../services/nodemailer/index");

function getUserFromToken(req) {
  return req.user;
}

exports.authenticate = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Token is missing or invalid format." });
  }
  token = token.split(" ")[1];
  try {
    const payload = verifyToken(token, "consumer");
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token." });
  }
};

// Endpoint 1: Request Ticket (send OTP via email and store pending ticket)
exports.raiseticket = async (req, res, next) => {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    // Now expecting an 'email' field instead of 'mobileNumber'
    const { email, ...ticketData } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const otp = await sendOTP(email);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const pendingTicket = new PendingTicket({
      ticketData: { ...ticketData, email, createdBy: user.id },
      email,
      otp,
      otpExpiresAt,
    });

    await pendingTicket.save();

    res.status(200).json({
      message: "OTP sent to your email. Please verify to raise the ticket.",
      pendingTicketId: pendingTicket._id,
    });
    next();
  } catch (err) {
    console.error("Error requesting ticket:", err);
    res
      .status(500)
      .json({ error: "Failed to send OTP or store pending ticket." });
  }
};

// Endpoint 2: Verify OTP and Raise Ticket
exports.verifyTicket = async (req, res, next) => {
  try {
    const { pendingTicketId, email, otp } = req.body;
    if (!pendingTicketId || !email || !otp) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Fetch the pending ticket data
    const pendingTicket = await PendingTicket.findById(pendingTicketId);
    if (!pendingTicket) {
      return res.status(404).json({ error: "Pending ticket not found." });
    }

    // Verify the email and OTP match
    if (pendingTicket.email !== email || pendingTicket.otp !== otp) {
      return res.status(400).json({ error: "OTP verification failed." });
    }

    if (pendingTicket.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: "OTP has expired." });
    }

    // Create and save the permanent ticket in MongoDB
    const newTicket = new Ticket(pendingTicket.ticketData);
    await newTicket.save();

    // Remove the pending ticket record
    await PendingTicket.findByIdAndDelete(pendingTicketId);

    res.status(201).json({
      message: "Ticket raised successfully and email verified.",
      ticket: newTicket,
    });
    next();
  } catch (err) {
    console.error("Error verifying ticket:", err);
    res.status(500).json({ error: "Failed to verify OTP or raise ticket." });
  }
};
