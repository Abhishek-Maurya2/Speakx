const express = require("express");
const router = express.Router();
const { getQuestions } = require("../controllers/questionsController");

router.post("/search", getQuestions);

module.exports = router;
