const { Router } = require("express");
const db = require("../database/db");
const router = Router();
const bcrypt = require("bcryptjs");
const { hashPassword } = require("../utils/helpers");

//gets list of users
router.get("/api/users", (req, res) => {
  const query = `select * from users`;
  db.query(query, (error, results) => {
    return error ? res.send(error) : res.send(results);
  });
});

//create user and add to database
router.post("/api/users", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hash = hashPassword(password);
  //check if email is in db
  //hash password
  //add user

  db.query(
    `insert into users (first_name,last_name,email,hashed) values(?,?,?,?);`,
    [firstName, lastName, email, hash],
    (error, results) => {
      return error
        ? res.send("email already exist")
        : res.send("account created");
    }
  );
});

router.post("/api/sign-in", (req, res) => {
  const { email, password } = req.body;
  //is email found in database
  //does password match
  //serialize user into session

  const query = `select * from users where email='${email}'`;

  db.query(query, email, (error, results) => {
    if (error) {
      res.send(error);
    } else {
      if (results.length) {
        const isValid = bcrypt.compareSync(password, results[0].hashed);
        if (isValid) {
          res.send("you are logged in");
        } else {
          res.send("wrong credentials");
        }
      } else {
        res.send("email not found");
      }
    }
  });
});

router.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const query = `select first_name,last_name,email from users where id=${id}`;
  db.query(query, id, (error, results) => {
    if (error) {
      res.send(error);
    }
    if (results.length) {
      res.send(results);
    } else {
      res.send("User doesn't exist");
    }
  });
});

module.exports = router;
