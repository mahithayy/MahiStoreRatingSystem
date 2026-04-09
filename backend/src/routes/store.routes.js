const express = require("express");
const router = express.Router();

const { getStoreRatings } = require("../controllers/store.controller");

const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.get("/", verifyToken, authorizeRoles("STORE_OWNER"), getStoreRatings);

module.exports = router;