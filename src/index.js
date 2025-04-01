const app = require("./app");
const config = require("./config");
const { connectDB } = require("./services/mongoose");

console.log("Connecting to MongoDB...");

connectDB()
  .then(() => {
    console.log("MongoDB connected 2.");
    console.log("About to listen on port:", config.port);
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
