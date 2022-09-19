const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/RoleController");

router.post("/role",RoleController.Role );

module.exports = router;