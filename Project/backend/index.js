const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("../backend/Models/User");
const Policy = require("../backend/Models/policy");

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = "your_secret_key";
const MONGO_URI = "mongodb://localhost:27017/authDB";
// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Generate JWT Token
function generateToken(userId) {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "30m" });
}

// Middleware to verify the JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Token is expired or invalid. Please login again." });
    }
    req.user = payload;
    next();
  });
}

// User Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    return res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/signup", async (req, res) => {
  try {
    const { name, email, mobile, dob, role, password } = req.body;

    if (!name || !email || !mobile || !dob || !role || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or Mobile already exists" });
    }

    const newUser = new User({ name, email, mobile, dob, role, password });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        dob: newUser.dob,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/add-policy", authenticateToken, async (req, res) => {
  try {
    const {
      Basic_Details,
      BMI,
      lifestyle,
      medicalHistory,
      nominees,
      additional,
    } = req.body;

    // Validate required fields
    if (!Basic_Details || !BMI || !nominees || !additional) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create a new policy document
    const newPolicy = new Policy({
      Basic_Details,
      BMI,
      lifestyle,
      medicalHistory,
      nominees,
      additional,
    });

    // Save policy to MongoDB
    await newPolicy.save();

    res
      .status(201)
      .json({ message: "Policy added successfully", policy: newPolicy });
  } catch (error) {
    console.error("Error adding policy:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
