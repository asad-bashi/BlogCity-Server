const { Router } = require("express");
const { getUser, getAllUsers, insertUser } = require("../database/db");
const router = Router();
const passport = require("passport");
const { isAuthenticated } = require("../utils/helpers");

//gets list of users
router.get("/api/users", async (req, res) => {
  try {
    const allUsers = await getAllUsers();
    res.send(JSON.stringify(allUsers));
  } catch (e) {
    res.send(JSON.stringify(e));
  }
});

//create user and add to database
router.post("/api/users", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    await insertUser(firstName, lastName, email, password);
    res.send(JSON.stringify({ message: "account created", isValid: true }));
  } catch (e) {
    res.send(
      JSON.stringify({ message: "email already exist", isValid: false })
    );
  }
});

router.post(
  "/api/login",
  passport.authenticate("local", {
    failureRedirect: "/api/login-failed",
    successRedirect: "/api/login-success",
  })
);
router.get("/api/login-failed", (req, res, next) => {
  res.send(JSON.stringify({ message: "login unsuccessful" }));
});

router.get("/api/login-success", (req, res) => {
  res.send(JSON.stringify({ message: "login successful" }));
});

//logout the user
router.post("/api/logout", isAuthenticated, (req, res) => {
  req.logout((e) => {
    if (e) {
      res.send(e);
    } else {
      res.send(JSON.stringify({ message: "logout successful" }));
    }
  });
});

//returns user with given id
router.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUser(id);
  if (!user) {
    return res.send(
      JSON.stringify({ message: "User doesn't exist", isValid: false })
    );
  }
  return res.send(JSON.stringify(user));
});

module.exports = router;
