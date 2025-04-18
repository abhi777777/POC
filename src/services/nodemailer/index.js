// services/mailer/index.js

const nodemailer = require("nodemailer");
const config = require("../../config");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email) => {
  const otp = generateOTP();

  //  transporter using SMTP settings from environment variables.
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  // the email options.
  const mailOptions = {
    from: config.smtp.fromEmail ,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  };

  // Send the email.
  await transporter.sendMail(mailOptions);
  return otp;
};

const sendPolicyReceiptEmail = async (toEmail, pdfBuffer) => {
  // Here we're using Gmail's service directly. This configuration
  // uses a specific app password.
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abhimanchauhan7@gmail.com",
      //pass: "",
    },
  });

  const mailOptions = {
    from: "abhimanchauhan7@gmail.com",
    to: toEmail,
    subject: "Your Policy Purchase Receipt",
    text: "Please find attached your policy receipt.",
    attachments: [
      {
        filename: "policy-receipt.pdf",
        content: pdfBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  generateOTP,
  sendOTP,
  sendPolicyReceiptEmail,
};
