const jwt = require("jsonwebtoken");
const errorWrapper = require("../../helpers/error/errorWrapper");
const User = require("../../models/User");

const CustomError = require("../../helpers/error/customError");

const getAccessToRoute = errorWrapper(async (req, res, next) => {
  // Is Token Included
  if (!isTokenIncluded(req)) {
    return next(
      new CustomError("You are not authorized to access this page", 403)
    );
  }
  // Get Token From Header
  const accessToken = getAccessTokenFromHeader(req);

  // Control If Token Valid
  jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      return next(
        new CustomError("You are not authorized to access this page", 401)
      );
    }
    req.user = {
      id: decodedToken.id,
      name: decodedToken.name,
    };
    next();
  });
});


const getAdminAccess = errorWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.role !== "admin") {
    return next(new CustomError("Only admins can access this route", 403));
  }
  return next();
});

const getAccessTokenFromHeader = (req) => {
  const accessToken = req.headers.authorization;

  return accessToken;
};
const isTokenIncluded = (req) => {
  return req.headers.authorization;
};

module.exports = {
  getAccessToRoute,
  getAdminAccess,
};
