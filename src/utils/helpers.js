const bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer();

//returns hashed version of given password
function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

//compares given password to hashed version
function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.send({ message: "must be logged in to access this route" });
}

module.exports = {
  hashPassword,
  comparePassword,
  isAuthenticated,
};
