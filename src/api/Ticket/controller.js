const Ticket = require("./model");
const PendingTicket = require("./model");
const { verifyToken } = require("../../services/jwt/index");
const { sendOTP, verifyOTP } = require("../../services/Twilio/index");

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

// Endpoint 1: Request Ticket (send OTP and store pending ticket)
exports.raiseticket = async (req, res, next) => {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const { mobileNumber, ...ticketData } = req.body;
    if (!mobileNumber) {
      return res
        .status(400)
        .json({ error: "mobileNumber number is required." });
    }

    // Send OTP via Twilio
    await sendOTP(mobileNumber);

    // Save the pending ticket data in temporary storage
    const pendingTicket = new PendingTicket({
      ticketData: { ...ticketData, createdBy: user.id },
      mobileNumber,
    });
    await pendingTicket.save();

    res.status(200).json({
      message:
        "OTP sent to your mobileNumber. Please verify to raise the ticket.",
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
    // Expect pendingTicketId, mobileNumber, and otp from the request body
    const { pendingTicketId, mobileNumber, otp } = req.body;
    if (!pendingTicketId || !mobileNumber || !otp) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Verify the OTP
    const status = await verifyOTP(mobileNumber, otp);
    if (status !== "approved") {
      return res.status(400).json({ error: "OTP verification failed." });
    }

    // Fetch the pending ticket data
    const pendingTicket = await PendingTicket.findById(pendingTicketId);
    if (!pendingTicket) {
      return res.status(404).json({ error: "Pending ticket not found." });
    }

    // Create and save the permanent ticket in MongoDB
    const newTicket = new Ticket(pendingTicket.ticketData);
    await newTicket.save();

    // Remove the pending ticket record
    await PendingTicket.findByIdAndRemove(pendingTicketId);

    res.status(201).json({
      message: "Ticket raised successfully and mobileNumber verified.",
      ticket: newTicket,
    });
    next();
  } catch (err) {
    console.error("Error verifying ticket:", err);
    res.status(500).json({ error: "Failed to verify OTP or raise ticket." });
  }
};
