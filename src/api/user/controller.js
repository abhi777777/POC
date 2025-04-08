const { User, Login } = require("./model");
const { generateToken } = require("../../services/jwt/index");

exports.register = async (req, res) => {
  try {
    const { name, email, mobile, dob, role, password, address } = req.body;

    const user = new User({
      name,
      email,
      mobile,
      dob,
      role,
      password,
      address,
    });

    await user.save();
    console.log("New user registered");
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Finding the user in the database");
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user does not exist , go register first");
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(400).json({ error: "Invalid email or password." });
    }
    console.log("user found!!!Welcome");
    console.log("generating token");
    const token = generateToken(user);

    const loginRecord = new Login({
      userId: user._id,
      role: user.role,
    });
    await loginRecord.save();
    console.log("record is saved in mongodb");
    return res.json({ token, role: user.role });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
