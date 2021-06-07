const express = require("express");

const {
  checkUserWordsExist,
} = require("../middlewares/database/databaseErrorHelpers");

const {
  getAllUserWords,
  // getAllUserLastWords,
  getQuiz,
  deleteUserWords,
  addNewUserWords
} = require("../controllers/userWords");

const {
  getAccessToRoute,
} = require("../middlewares/authorization/auth");

const router = express.Router({ mergeParams: true });

router.get("/", getAccessToRoute, getAllUserWords);
router.get("/quiz", getAccessToRoute, getQuiz);

// router.get("/last", getAccessToRoute, getAllUserLastWords);

// router.get("/quiz",getAllUserLastWords);

router.post("/", [getAccessToRoute, checkUserWordsExist], addNewUserWords);
router.delete("/:id/delete", [getAccessToRoute, checkUserWordsExist], deleteUserWords);

module.exports = router;
