const errorWrapper = require("../helpers/error/errorWrapper");

const denemess = () => {
  var text =
    "Printing values stored cv book in objects book use as arrays UserName = user12 uSed Password = 12345 Email = user123@gmail.com Book = CSHARP";

  //    var result = text.replace(/[\W_]+/g," ");
  var result = text.replace(/[^a-zA-Z]+/g, " ").toLowerCase();
  console.log(result);
};

const deneme = errorWrapper(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "questions",
  });
});

module.exports = deneme;
