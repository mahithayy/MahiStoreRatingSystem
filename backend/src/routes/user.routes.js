const express = require("express");
const router = express.Router();

const {
  getStores,
  submitRating,
} = require("../controllers/user.controller");

const { verifyToken } = require("../middleware/auth.middleware");

router.get("/stores", verifyToken, getStores);
router.post("/rate", verifyToken, submitRating);

module.exports = router;