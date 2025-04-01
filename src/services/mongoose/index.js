const mongoose = require("mongoose");
const config = require("../../config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.dbURI, {});
    console.log("MongoDB chal gyaaa 1");
  } catch (err) {
    console.error("Mongo nhi chala", err);
    process.exit(1);
  }
};

module.exports = { connectDB };
