const { Router } = require("express");
const { getUser, getAllUsers, insertUser } = require("../database/db");
const router = Router();
const passport = require("passport");

//gets list of users
router.get("/api/users", async (req, res) => {
  try {
    const allUsers = await getAllUsers();
    res.send(allUsers);
  } catch (e) {
    res.send(e);
  }
});

//create user and add to database
router.post("/api/users", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    await insertUser(firstName, lastName, email, password);
    res.send("account created");
  } catch (e) {
    res.send("email already exist");
  }
});

router.post(
  "/api/login",
  passport.authenticate("local", {
    failureRedirect: "/api/login-failed",
    successRedirect: "/api/login-success",
    failureMessage: true,
  })
);

router.get("/api/login-failed", (req, res, next) => {
  const message = req.session.messages[req.session.messages.length - 1];
  res.send({ message });
});

router.get("/api/login-success", (req, res) => {
  res.send({ message: "login successful" });
});

router.post("/api/logout", (req, res) => {
  req.logout((e) => {
    if (e) {
      res.send(e);
    } else {
      res.send({ message: "logout successful" });
    }
  });
});

router.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUser(id);
  if (!user) {
    return res.send("User doesn't exist");
  }
  return res.send(user);
});

module.exports = router;
