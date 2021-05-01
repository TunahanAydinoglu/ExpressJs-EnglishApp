const express = require("express");
const contact = require("../controllers/contact");
const deneme = require("../controllers/try");

const router = express.Router();

router.post("/new", contact);
router.post("/try", deneme);

module.exports = router;
