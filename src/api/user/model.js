const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    role: {
      type: String,
      enum: ["consumer", "producer", "TicketHandler"],
      required: true,
    },
    password: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
const loginSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    loginTime: { type: Date, default: Date.now },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

const Login = mongoose.model("Login", loginSchema);
module.exports = { User, Login };
