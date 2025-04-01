const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.use(controller.authenticate);

// Producer routes
router.post("/CreatePolicies", controller.createPolicy);
router.get("/Mypolicies", controller.getMyPolicies);

// Consumer routes
router.post("/buy", controller.buyPolicy);
router.get("/purchases", controller.getMyPurchases);

module.exports = router;
