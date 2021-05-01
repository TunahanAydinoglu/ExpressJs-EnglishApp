const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const VocabularySchema = new Schema({
  word: {
    type: String,
    unique:true,
    required: [true, "Please provide a title"],
    minlength: [1, "Please provide title at least 1 characters"],
  },
  translation: {
    type: String,
    required: [true, "Please provide a content"],
    minlength: [1, "Please provide content at least 1 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Pre Save Method
VocabularySchema.pre("save", async function (next) {
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

module.exports = mongoose.model("Vocabulary", VocabularySchema);
