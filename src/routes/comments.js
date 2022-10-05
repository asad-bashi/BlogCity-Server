const { Router } = require("express");
const router = Router();
const {
  getCommentsByBlogId,
  insertComment,
  deleteComment,
  getComment,
  editComment,
} = require("../database/db");
const { isAuthenticated } = require("../utils/helpers");


router.get("/api/comments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await getComment(id);
    if (comment) {
      return res.send(JSON.stringify(comment));
    }
    return res.send(JSON.stringify({ message: "comment not found" }));
  } catch (e) {
    res.send(e);
  }
});

//return all comments that match blog id given
router.get("/api/commentsByBlogId/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const comments = await getCommentsByBlogId(id);
    res.send(JSON.stringify(comments));
  } catch (e) {
    res.send(e);
  }
});

//creates a new comment and adds it to database
router.post("/api/comments", isAuthenticated, async (req, res) => {
  const { comment, blog_id } = req.body;
  const user_id = req.user.id;

  try {
    const test = await insertComment(comment, blog_id, user_id);
    console.log(test);
    res.send(JSON.stringify({ message: "comment added" }));
  } catch (e) {
    res.send(e);
  }
});

router.put("/api/comments/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;

  try {
    const comment = await getComment(id);
    if (!comment) {
      return res.send(JSON.stringify(false));
    }
    await editComment(body, id);
    return res.send(JSON.stringify(true));
  } catch (e) {
    res.send(e);
  }
});

//deletes comment with givne id
router.delete("/api/comments/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const comment = await getComment(id);
    if (user_id === comment.user_id) {
      await deleteComment(id);
      return res.send(JSON.stringify({ message: "comment deleted" }));
    }
    return res.send(
      JSON.stringify({ message: "You're not authorized to reach this page" })
    );
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
