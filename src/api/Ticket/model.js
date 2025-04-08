const mongoose = require("mongoose");

// Ticket Schema
const TicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
  newAddress: String,
  newName: String,
  newPhoneNumber: String,
  ProofFile: {
    filename: { type: String, required: true },
    fileType: {
      type: String,
      enum: ["application/pdf"],
      required: true,
    },
    fileUrl: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// PendingTicket Schema
const pendingTicketSchema = new mongoose.Schema({
  ticketData: { type: Object, required: true },
  otpSentAt: { type: Date, default: Date.now },
  otp: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true },
  email: { type: String, required: true },
});

// ✅ Defensive model registration
const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);

const PendingTicket =
  mongoose.models.PendingTicket ||
  mongoose.model("PendingTicket", pendingTicketSchema);

module.exports = {
  Ticket,
  PendingTicket,
};
