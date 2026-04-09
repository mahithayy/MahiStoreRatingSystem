const express = require("express");
const router = express.Router();

const { register, login, changePassword } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
router.post("/register", register);
router.post("/login", login);
router.post("/change-password", verifyToken, changePassword);

module.exports = router;