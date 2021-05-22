const express = require("express");
const cors = require("cors");

const auth = require("./auth");
const admin = require("./admin");
const user = require("./user");
const contact = require("./contact");
const words = require("./words");
const translateVocabulary = require("./translateVocabulary");
const deneme = require("../controllers/try");

const router = express.Router();

router.use(cors());
router.use("/auth", auth);
router.use("/admin", admin);
router.use("/users", user);
router.use("/contact", contact);
router.use("/words", words);
router.use("/translateVocabulary", translateVocabulary);
router.use("/deneme", deneme);

module.exports = router;
