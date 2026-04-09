const express = require("express");
const router = express.Router();

const {
  createUser,
  createStore,
  getDashboard,
  getUsers,
  getStores
} = require("../controllers/admin.controller");

const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.post("/users", verifyToken, authorizeRoles("ADMIN"), createUser);
router.post("/stores", verifyToken, authorizeRoles("ADMIN"), createStore);
router.get("/dashboard", verifyToken, authorizeRoles("ADMIN"), getDashboard);
router.get("/users", verifyToken, authorizeRoles("ADMIN"), getUsers);
router.get("/stores", verifyToken, authorizeRoles("ADMIN"), getStores);

module.exports = router;