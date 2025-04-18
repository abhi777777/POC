const { Policy, Purchase } = require("./model");
const { verifyToken } = require("../../services/jwt/index");
const { generatePDFReceipt } = require("../../services/pdfkit/index");
const { sendPolicyReceiptEmail } = require("../../services/nodemailer/index");
// this function fetch user from token itself
function getUserFromToken(req) {
  return req.user;
}
exports.authenticate = (req, res, next) => {
  // fetch token from req
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token provided." });
  // the token has bearer in front of it we remove it through slicing
  token = token.slice(7).trim();
  try {
    let payload;
    try {
      payload = verifyToken(token, "consumer");
    } catch (e) {
      payload = verifyToken(token, "producer");
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: " + err.message });
  }
};

// Producer endpoints
// Create policy
exports.createPolicy = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (user.role !== "producer") {
      return res
        .status(403)
        .json({ error: "Only producers can create policies." });
    }
    const policyData = { ...req.body, createdBy: user.id };
    const policy = new Policy(policyData);
    await policy.save();
    res.status(201).json({ message: "Policy created successfully.", policy });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get policies created by the logged-in producer
exports.getMyPolicies = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (user.role !== "producer") {
      return res
        .status(403)
        .json({ error: "Only producers can view their policies." });
    }
    console.log("found user");
    const policies = await Policy.find({ createdBy: user.id });
    res.json({ policies });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Consumer endpoints
// Buy a policy (consumer only)
exports.buyPolicy = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (user.role !== "consumer") {
      return res
        .status(403)
        .json({ error: "Only consumers can buy policies." });
    }

    const { policyId } = req.body;

    const purchase = new Purchase({
      consumer: user.id,
      policy: policyId,
    });

    await purchase.save();

    // Generate PDF and attach it
    const pdfBuffer = await generatePDFReceipt(user, purchase);
    await sendPolicyReceiptEmail(user.email, pdfBuffer);
    res.status(201).json({
      message: "Policy purchased. PDF sent.",
      purchase,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List purchased policies for consumer
exports.getMyPurchases = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (user.role !== "consumer") {
      return res
        .status(403)
        .json({ error: "Only consumers can view their purchases." });
    }
    const purchases = await Purchase.find({ consumer: user.id }).populate(
      "policy"
    );
    res.json({ purchases });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
