const User = require("../models/User");
const errorWrapper = require("../helpers/error/errorWrapper");
const CustomError = require("../helpers/error/customError");
const Vocabulary = require("../models/Vocabulary");



const getAllUsers = errorWrapper(async (req, res, next) => {
    return res
        .status(200)
        .json(res.advanceQueryResults);
});

const getSingleUser = errorWrapper(async (req, res, next) => {

    const { id } = req.params;
    console.log("denem");

    const user = await User.findById(id).populate("userWords").populate("userLastWords");

    return res
        .status(200)
        .json({
            success: true,
            data: user
        });
});
const deleteUser = errorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    await user.remove();

    return res.status(200)
        .json({
            success: true,
            data: {}
        });


});
const getBlockUser = errorWrapper(async (req, res, next) => {

    const { id } = req.params;

    const user = await User.findById(id);

    await User.updateOne({ _id: user._id }, { blocked: !user.blocked });

    return res
        .status(200)
        .json({
            success: true,
            message: "User Blocked Successfully"
        });

});

const addVocabulary = errorWrapper(async (req, res, next) => {
    var { word, translation } = req.body;
    await Vocabulary.create({
        word: word.toLowerCase(),
        translation: translation.toLowerCase()
    })

    return res
        .status(200)
        .json({
            success: true,
            message: "Added word"
        });

});

module.exports = {
    getAllUsers,
    getSingleUser,
    deleteUser,
    getBlockUser,
    addVocabulary
}

