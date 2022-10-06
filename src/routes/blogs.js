const { Router } = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = Router();
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "BLOGCITY",
  },
});
const upload = multer({ storage });
const {
  getBlog,
  getBlogs,
  getBlogsByUserId,
  insertBlog,
  editBlog,
  deleteBlog,
  insertTag,
  getBlogsByCategory,
  getNumberOfComments,
} = require("../database/db");
const { isAuthenticated } = require("../utils/helpers");

//returns all blogs
router.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await getBlogs();

    const test = await Promise.all(
      blogs.map(async (blog) => {
        return { ...blog, numOfComments: await getNumberOfComments(blog.id) };
      })
    );

    return res.send(JSON.stringify(test));
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
      return res.send(JSON.stringify(false));
    }
    return res.send(JSON.stringify(blog));
  } catch (e) {
    return res.send(e);
  }
});

router.get("/api/category-blogs/:category", async (req, res) => {
  const { category } = req.params;
  if (category === "All") {
    return res.redirect("/api/blogs");
  }
  try {
    const blogs = await getBlogsByCategory(category);
    const blogsWithComments = await Promise.all(
      blogs.map(async (blog) => {
        return {
          ...blog,
          numOfComments: await getNumberOfComments(blog.id),
        };
      })
    );
    res.send(JSON.stringify(blogsWithComments));
  } catch (e) {
    res.send(e);
  }
});

router.get("/api/blogs-by-userid/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const blogs = await getBlogsByUserId(user_id);
    const blogsWithComments = await Promise.all(
      blogs.map(async (blog) => {
        return {
          ...blog,
          numOfComments: await getNumberOfComments(blog.id),
        };
      })
    );
    res.send(JSON.stringify(blogsWithComments));
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
      return res.send(JSON.stringify({ message: "Invalid Image Type" }));
    }

    const image = req.file.path;
    const id = req.user.id;

    try {
      const { insertId } = await insertBlog(title, body, id, image);
      await insertTag(selectedTags, insertId);
      return res.send(JSON.stringify({ message: "blog added", id: insertId }));
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
      return res.send(JSON.stringify(false));
    }
    await editBlog(title, body, id);
    return res.send(JSON.stringify(true));
  } catch (e) {
    res.send(e);
  }
});

router.delete("/api/blogs/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const blog = await getBlog(id);
    if (user_id === blog.user_id) {
      const path = blog.image;
      await deleteBlog(id);
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
        }
      });
      return res.send(JSON.stringify("blog was deleted"));
    }
    return res.send(
      JSON.stringify({ message: "You're not authorized to reach this page" })
    );
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
