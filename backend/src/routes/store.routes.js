const express = require("express");
const router = express.Router();

const { getStoreRatings, replyToRating } = require("../controllers/store.controller");

const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.get("/", verifyToken, authorizeRoles("STORE_OWNER"), getStoreRatings);
router.put("/ratings/:id/reply", verifyToken, authorizeRoles("STORE_OWNER"), replyToRating);
module.exports = router;