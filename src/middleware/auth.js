const jwt = require("jsonwebtoken");
const User = require("../db/module");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: verifyToken._id });
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).render("login");
  }
};

module.exports = auth;
