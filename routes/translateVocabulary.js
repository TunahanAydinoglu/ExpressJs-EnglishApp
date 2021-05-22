const express = require("express");


const { postTranslateVocabulary } = require("../controllers/translateVocabulary");
const {
    getAccessToRoute,
  } = require("../middlewares/authorization/auth");

const router = express.Router({ mergeParams: true });

router.post("/",getAccessToRoute, postTranslateVocabulary);

module.exports = router;
