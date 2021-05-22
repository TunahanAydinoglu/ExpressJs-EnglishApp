const errorWrapper = require("../helpers/error/errorWrapper");

const TranslateVocabulary = require("../models/TranslateVocabulary");

const postTranslateVocabulary = errorWrapper(async (req, res, next) => {
  const translateVocabulary = req.body;

  const response = await TranslateVocabulary.create({
    word: translateVocabulary.word,
    translation: translateVocabulary.translation,
  });

  res.status(201).json({
    success: true,
    data: response,
  });
});

module.exports = {
    postTranslateVocabulary,
};
