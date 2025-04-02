const mongoose = require("mongoose");
const TicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
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
  newAddress: {
    type: String,
  },
  newName: {
    type: String,
  },
  newPhoneNumber: {
    type: String,
  },

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const pendingTicketSchema = new mongoose.Schema({
  ticketData: {
    type: Object,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  otpSentAt: {
    type: Date,
    default: Date.now,
  },
});

const PendingTicket = mongoose.model("PendingTicket", pendingTicketSchema);
const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = {
  PendingTicket,
  Ticket,
};
