const UserWord = require("../models/UserWord");

const errorWrapper = require("../helpers/error/errorWrapper");
const User = require("../models/User");
const Vocabulary = require("../models/Vocabulary");
const UserLastWord = require("../models/UserLastWord");

const getAllUserWords = errorWrapper(async (req, res, next) => {
  const user_id = req.user.id;
  const user = await User.findById(user_id).populate("userWords");

  const userData = {
    name : user.name,
    email : user.email,
    role : user.role,
    isShowCount : user.isShowCount,
    isShowMemory : user.isShowMemory,
    blocked : user.blocked,
  };
  
  const userWords = await user?.userWords;

  res.status(200).json({
    success: true,
    user: userData,
    data: userWords,
  });
});

const getAllUserLastWords = errorWrapper(async (req, res, next) => {
  const user_id = req.user.id;
  const user = await User.findById(user_id).populate("userLastWords");

  const userData = {
    name : user.name,
    email : user.email,
    role : user.role,
    isShowCount : user.isShowCount,
    isShowMemory : user.isShowMemory,
    blocked : user.blocked,
  };

  const userLastWords = await user?.userLastWords;

  res.status(200).json({
    success: true,
    user : userData,
    data: userLastWords,
  });
});

const addNewUserWords = errorWrapper(async (req, res, next) => {
  const user_id = req.user.id;
  let { uniqueWords } = req;
  let newWords = new Array();
  let oldWordIds = new Array();
  let addedWords = new Array();
  let lastWords = new Array();

  const user = await User.findById(user_id)
    .populate("userWords")
    .populate("userLastWords");

  user.userLastWords = [];
  user.save();

  uniqueWords.forEach((word) => {
    let checker = true;
    user.userWords.forEach((el, index) => {
      if (el.word == word) {
        checker = false;
        oldWordIds.push(el._id);
      }
    });
    if (checker) {
      newWords.push(word);
    }
  });

  //yeni gorulen kelimeleri ekle
  newWords.forEach(async (word) => {
    if (word != "") {
      let dbWord = await Vocabulary.find({ word: word });
      await UserWord.create({
        word: word,
        translation:
          dbWord.length > 0 ? dbWord.translation : "kelime bulunamadi",
        user: user_id,
      });
      addedWords.push(word);
    }
  });

  //eski gorulen kelimelerin sayacini arttir
  oldWordIds.forEach(async (id) => {
    let userWord = await UserWord.findById(id);
    userWord.counter++;
    userWord.save();
    lastWords.push(userWord);
  });

  const delResult = await UserLastWord.deleteMany({
    user: user_id,
  });

  lastWords.forEach(async (wordModel) => {
    let dbWord = await Vocabulary.find({ word: wordModel.word });
    await UserLastWord.create({
      word: wordModel.word,
      translation: dbWord.length > 0 ? dbWord.translation : "kelime bulunamadi",
      user: user_id,
      counter: wordModel.counter,
      isMemory: wordModel.isMemory,
    });
  });

  addedWords.forEach(async (word) => {
    if (word != "") {
      let dbWord = await Vocabulary.find({ word: word });
      await UserLastWord.create({
        word: word,
        translation:
          dbWord.length > 0 ? dbWord.translation : "kelime bulunamadi",
        user: user_id,
      });
    }
  });

  res.status(200).json({
    success: true,
    data: addedWords,
  });
});

module.exports = {
  getAllUserWords,
  addNewUserWords,
  getAllUserLastWords
};
