const { Router } = require("express");
const router = Router();
const { getBlog, getBlogs, insertBlog } = require("../database/db");
const { isAuthenticated } = require("../utils/helpers");

//returns all blogs
router.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await getBlogs();
    return res.send(blogs);
  } catch (e) {
    return res.send(e);
  }
});

//returns blog coresponding with given id
router.get("/api/blogs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await getBlog(id);
    if (!blog) {
      return res.send("blog not found");
    }
    return res.send(blog);
  } catch (e) {
    return res.send(e);
  }
});

//creates new blog entry and adds to database
router.post("/api/blogs", isAuthenticated, async (req, res) => {
  const { title, body } = req.body;
  const id = req.user.id;

  try {
    await insertBlog(title, body, id);
    return res.send("blog added");
  } catch (e) {
    return res.send(e);
  }
});

module.exports = router;
