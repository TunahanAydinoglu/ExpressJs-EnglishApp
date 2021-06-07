const UserWord = require("../models/UserWord");

const errorWrapper = require("../helpers/error/errorWrapper");
const User = require("../models/User");
const Vocabulary = require("../models/Vocabulary");
const UserLastWord = require("../models/UserLastWord");

const getAllUserWords = errorWrapper(async (req, res, next) => {
  const user_id = req.user.id;
  const user = await User.findById(user_id).populate("userWords");

  const userData = {
    id: user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profile_image,
    userLastWordCount: user.userLastWordCount,
    isShowCount: user.isShowCount,
    isShowMemory: user.isShowMemory,
    blocked: user.blocked,
  };

  const userWords = await user.userWords.sort((a, b) => { return b.updatedAt - a.updatedAt });

  res.status(200).json({
    success: true,
    userInfo: userData,
    data: userWords,
  });
});

const getQuiz = errorWrapper(async (req, res, next) => {
  const user_id = req.user.id;
  const user = await User.findById(user_id).populate("userWords");
  const userWords = user.userWords;

  const shuffleWords = userWords.sort(() => .5 - Math.random());

  let quiz = shuffleWords.map((word, index) => {
    let answerIndex = Math.floor(Math.random() * 4);

    let answersWordsIndexs = [];
    answersWordsIndexs.push(index);

    let counter = 0;
    while (counter < 3) {
      let randomIndex = Math.floor(Math.random() * shuffleWords.length);
      if (randomIndex != index) {
        answersWordsIndexs.push(randomIndex);
        counter++;
      }
    }

    let optionsArray = [];
    answersWordsIndexs.map((rank, index) => {
      optionsArray[index] = shuffleWords[rank].translation;
    })

    let questionWord = {
      id: index + 1,
      question: word.word,
      answer_index: answerIndex,
      options: optionsArray
    };

    return questionWord;
  });

  res.status(200).json({
    success: true,
    questionCount: shuffleWords.length,
    data: quiz
  });
})

// const getAllUserLastWords = errorWrapper(async (req, res, next) => {
//   const user_id = req.user.id;
//   const user = await User.findById(user_id).populate("userLastWords");

//   const userData = {
//     id : user_id,
//     name : user.name,
//     email : user.email,
//     role : user.role,
//     profileImage: user.profile_image,
//     isShowCount : user.isShowCount,
//     isShowMemory : user.isShowMemory,
//     blocked : user.blocked,
//   };

//   const userLastWords = await user?.userLastWords;

//   res.status(200).json({
//     success: true,
//     userInfo : userData,
//     data: userLastWords,
//   });
// });

const deleteUserWords = errorWrapper(async (req,res,next)=>{
  const {id} = req.params;

  await User.findByIdAndRemove(id);

  res.status(200).json({
    success: true,
    data: {},
  });
})
const addNewUserWords = errorWrapper(async (req, res, next) => {
  const user_id = req.user.id;
  let { uniqueWords } = req;
  let newWords = new Array();
  let oldWordIds = new Array();
  let addedWords = new Array();
  // let lastWords = new Array();

  const user = await User.findById(user_id)
    .populate("userWords");

  user.userLastWordCount = uniqueWords.length;
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
  newWords.forEach(async (wordd) => {
    if (wordd != "") {
      let dbWord = await Vocabulary.findOne({ word: wordd });
      await UserWord.create({
        word: wordd,
        translation:
          dbWord ? dbWord.translation : "kelime bulunamadi",
        user: user_id,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      addedWords.push(wordd);
    }
  });

  //eski gorulen kelimelerin sayacini arttir
  oldWordIds.forEach(async (id) => {
    let userWord = await UserWord.findById(id);
    userWord.counter++;
    userWord.updatedAt = Date.now();
    userWord.save();
    // lastWords.push(userWord);
  });

  res.status(200).json({
    success: true,
    addedCount: uniqueWords.length
  });
});

module.exports = {
  getAllUserWords,
  getQuiz,
  deleteUserWords,
  addNewUserWords
};
