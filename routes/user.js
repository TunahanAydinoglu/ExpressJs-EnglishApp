const express = require("express");

const router = express.Router();
const {
  checkUserExist,
} = require("../middlewares/database/databaseErrorHelpers");

// users,profile
const { getSingleUser } = require("../controllers/admin");

// Get Single User Profile
router.get("/profile/:id", checkUserExist, getSingleUser);

module.exports = router;
