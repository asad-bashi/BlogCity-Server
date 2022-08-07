const { Router } = require("express");
const db = require("../database/db");
const router = Router();

router.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const query = `select first_name,last_name,email from users where id=${id}`;
  db.query(query,id,(error,results)=>{
    if(error){
        res.send('cannont find user')
    }
    res.send(results)
  })

});

router.post("/api/sign-in", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashed = hash(password);
  const query = "select * from users where email=?;";
  db.query(query, email, (error, results) => {
    if (!results.length) {
      res.send("user not found");
    }
    console.log(results[0].hashed);
    console.log(hashed);
    if (hashed === results[0].hashed) {
      res.send(results);
    } else {
      res.send("invalid password");
    }
  });
});

//create user and add to database
router.post("/api/users", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashed = hash(password);
  console.log("request received");
  const query =
    "insert into users(first_name,last_name,email,hashed) values(?,?,?,?);";
  db.query(query, [firstName, lastName, email, hashed], (error, results) => {
    if (error) {
      res.send("error");
      console.log(error);
    }
    res.send(results);
  });
});

module.exports = router;
