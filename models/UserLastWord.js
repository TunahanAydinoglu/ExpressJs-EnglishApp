const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const UserLastWordSchema = new Schema({
  word: {
    type: String,
    required: [true, "Please provide a title"],
  },
  translation: {
    type: String,
  },
  // slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  counter: {
    type: Number,
    default: 1,
    min: 0,
  },
  isMemory: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Pre Save Method
UserLastWordSchema.pre("save", async function (next) {
  if (!this.isModified("word")) {
    next();
  } else {
    try {
      const user = await User.findById(this.user);
      user.userLastWords.push(this.id);
      await user.save();
      next();
    } catch (err) {
      next(err);
    }
  }
});

module.exports = mongoose.model("UserLastWord", UserLastWordSchema);
