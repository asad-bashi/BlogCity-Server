const { Router } = require("express");
const multer = require("multer");
const router = Router();
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Images/");
  },

  filename: function (req, file, cb) {
    // Windows OS doesn't accept files with a ":"
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  // Only accepts images of type jpeg and png
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });
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
router.post(
  "/api/blogs",
  isAuthenticated,
  upload.single("img"),
  async (req, res) => {
    const { title, body, selectedTags } = req.body;
    if (!req.file) {
      return res.send({ message: "Invalid Image Type" });
    }

    const image = req.file.path;
    const id = req.user.id;

    try {
      const { insertId } = await insertBlog(title, body, id, image);
      await insertTag(selectedTags, insertId);
      return res.send({ message: "blog added", id: insertId });
    } catch (e) {
      return res.send(e);
    }
  }
);

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
    const blog = await getBlog(id);
    const path = blog.image;
    await deleteBlog(id);
    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
    console.log(blog);
    res.send("blog was deleted");
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
