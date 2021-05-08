const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const UserWordSchema = new Schema({
  word: {
    type: String,
    required: [true, "Please provide a word"],
  },
  translation: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
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
UserWordSchema.pre("save", async function (next) {
  if (!this.isModified("word")) {
    next();
  } else {
    try {
      const user = await User.findById(this.user);
      user.userWords.push(this.id);
      await user.save();
      next();
    } catch (err) {
      next(err);
    }
  }
});

// UserWordSchema.methods.makeSlug = function () {
//   return slugify(this.title, {
//     replacement: "-",
//     remove: /[*+~.()'"!:@]/g,
//     lower: true,
//   });
// };

module.exports = mongoose.model("UserWord", UserWordSchema);
