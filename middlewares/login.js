const jwt = require("jsonwebtoken");
const createError = require("../helpers/createError");
const { User } = require("../models/User");

const { JWT_SECRET } = process.env;

const login = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(createError(401));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(id);

    if (!user || !user.token) {
      next(createError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, "Not authorized"));
  }
};

module.exports = login;
