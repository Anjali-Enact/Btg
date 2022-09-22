const express = require("express");
const router = express.Router();
const Staff = require("../controllers/StaffDetailController");

router.post("/api/staffInfo", function(req, res){
    Staff.staffInfo
}
    );

module.exports = router;