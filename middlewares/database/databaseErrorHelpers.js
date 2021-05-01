const path = require("path");
const slugify = require("slugify");
const UserWord = require("../../models/UserWord");
const root = path.dirname(require.main.filename);

const User = require(root + "/models/User");

const errorWrapper = require(root + "/helpers/error/errorWrapper");
const CustomError = require(root + "/helpers/error/customError");

const checkUserWordsExist = errorWrapper(async (req, res, next) => {
  const { text } = req.body;
  const user_id = req.user.id;
  let data = makeToArrayFromText(text);
  let unique = [...new Set(data)];

  const user = await User.findById(user_id);
  if (!user) {
    return next(new CustomError(`User Not Found with Id : ${user_id}`, 404));
  }

  req.uniqueWords = unique;
  next();
});

const makeToArrayFromText = (text) => {
  const data = text.replace(/[^a-zA-Z]+/g, " ").toLowerCase()
  return data.split(" ");
};

const checkUserExist = errorWrapper(async (req, res, next) => {
  const user_id = req.params.id;

  const user = await User.findById(user_id);

  if (!user) {
    return next(new CustomError(`User Not Found with Id : ${user_id}`, 404));
  }
  next();
});

module.exports = {
  checkUserWordsExist,
  checkUserExist,
};
