const { Router } = require("express");
const router = Router();
const {
  getBlog,
  getBlogs,
  insertBlog,
  editBlog,
  deleteBlog,
  insertTag,
  getBlogsByCategory,
} = require("../database/db");
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
      return res.send(false);
    }
    return res.send(blog);
  } catch (e) {
    return res.send(e);
  }
});

router.get("/api/category-blogs/:category", async (req, res) => {
  const { category } = req.params;
  if (category === "All") {
    const blogs = await getBlogs();
    return res.send(blogs);
  }
  try {
    const blogs = await getBlogsByCategory(category);
    res.send(blogs);
  } catch (e) {
    res.send(e);
  }
});

//creates new blog entry and adds to database
router.post("/api/blogs", isAuthenticated, async (req, res) => {
  const { title, body, selectedTags } = req.body;
  const id = req.user.id;

  try {
    const { insertId } = await insertBlog(title, body, id);
    await insertTag(selectedTags, insertId);
    return res.send("blog added");
  } catch (e) {
    return res.send(e);
  }
});

//edits post with given id
router.put("/api/blogs/:id", isAuthenticated, async (req, res) => {
  const { title, body } = req.body;
  const { id } = req.params;

  try {
    const blog = await getBlog(id);
    if (!blog) {
      return res.send(false);
    }
    await editBlog(title, body, id);
  } catch (e) {
    res.send(e);
  }
});

router.delete("/api/blogs/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteBlog(id);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
