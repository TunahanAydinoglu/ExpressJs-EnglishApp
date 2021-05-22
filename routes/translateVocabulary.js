const express = require("express");


const { postTranslateVocabulary } = require("../controllers/translateVocabulary");

const router = express.Router({ mergeParams: true });

router.post("/", postTranslateVocabulary);

module.exports = router;
