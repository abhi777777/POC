const express = require("express");
const router = express.Router();
const controller = require("./controller");

// this is to verify if that is the consumer only
router.use(controller.authenticate);
router.post("/raiseticket", controller.raiseticket);
router.post("/verify", controller.verifyTicket);

module.exports = router;
