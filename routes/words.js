const express = require("express");

const {
  checkUserWordsExist,
} = require("../middlewares/database/databaseErrorHelpers");

const {
  getAllUserWords,
  // getAllUserLastWords,
  addNewUserWords
} = require("../controllers/userWords");

const {
  getAccessToRoute,
} = require("../middlewares/authorization/auth");

const router = express.Router({ mergeParams: true });

router.get("/", getAccessToRoute, getAllUserWords);

// router.get("/last", getAccessToRoute, getAllUserLastWords);

// router.get("/quiz",getAllUserLastWords);

router.post("/", [getAccessToRoute, checkUserWordsExist], addNewUserWords);

module.exports = router;
