
const express = require("express");
const router = express.Router();
const controller = require("./controller");
// routes routing to either register or login
router.post("/register", controller.register);
router.post("/login", controller.login);
module.exports = router;
