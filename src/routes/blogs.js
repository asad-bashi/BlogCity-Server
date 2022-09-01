const { Router } = require("express");
const router = Router();
const { db, getBlog, getBlogs } = require("../database/db");

//returns all blogs
router.get("/api/blogs", async (req, res) => {
  const blogs = await getBlogs();
  res.send(blogs);
});

//returns blog coresponding with given id
router.get("/api/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await getBlog(id);
  if (!blog) {
    return res.send("blog not found");
  }
  return res.send(blog);
});

//creates new blog entry and adds to database
router.post("/api/blogs", (req, res) => {
  const { title, body } = req.body;

  const query = "insert into blogs(title,body,user_id) values(?,?,?)";
  db.query(query, [title, body, 1], (error, results) => {
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
