const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const TranslateVocabularySchema = new Schema({
  word: {
    type: String,
    unique:true,
    minlength:2,
    required: [true, "Please provide a word"],
  },
  translation: {
    type: String,
    minlength:1,
    required: [true, "Please provide a translation"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Pre Save Method
TranslateVocabularySchema.pre("save", async function (next) {
  if (!this.isModified("word")) {
    next();
  } else {
    try {
      next();
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = mongoose.model("TranslateVocabulary", TranslateVocabularySchema);
