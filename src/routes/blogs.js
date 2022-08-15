const { Router } = require("express");
const router = Router();
const db = require("../database/db");

//returns all blogs
router.get("/api/blogs", (req, res) => {
  const query = `select title,body,date_format(created_at,'%M %d, %Y') as 'date',concat(users.first_name,' ',users.last_name) as 'name' from blogs
join users on blogs.user_id = users.id
`;
  db.query(query, (error, results, fields) => {
    return error ? res.send(error) : res.send(results);
  });
});

router.get("/api/blogs/:id", (req, res) => {
  const { id } = req.params;
  const query = `select title,body,date_format(created_at,'%M %d %Y') as date ,concat(users.first_name,' ',users.last_name) as 'name' from blogs join users on blogs.user_id = users.id where blogs.id=${id}`;
  db.query(query, id, (error, results) => {
    if (error) {
      res.send(error);
    }
    return !results.length ? res.send("blog not found") : res.send(results);
  });
});

//creates new blog entry and adds to database
router.post("/api/blogs", (req, res) => {
  const { title, body } = req.body;

  const query = "insert into blogs(title,body,user_id) values(?,?,?)";
  db.query(query, [title, body, 1], (error, results) => {
    console.log(error);
    return error ? res.send("error blog not added") : res.send("blog added");
    // if (error) {
    //   console.log(error);
    //   res.send("Invalid Blog Combination");
    // } else {
    //   res.send("Blog Successfully Added");
    // }
  });
});

module.exports = router;
