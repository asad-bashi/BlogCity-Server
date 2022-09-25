const { Router } = require("express");
const router = Router();
const { getCommentsByBlogId, insertComment } = require("../database/db");
const { isAuthenticated } = require("../utils/helpers");

//return all comments that match blog id given
router.get("/api/comments/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const comments = await getCommentsByBlogId(id);
    res.send(comments);
  } catch (e) {
    res.send(e);
  }
});

router.post("/api/comments", isAuthenticated, async (req, res) => {
  const { comment, blog_id } = req.body;
  const user_id = req.user.id;

  try {
    const test = await insertComment(comment, blog_id, user_id);
    console.log(test);
    res.send({ message: "comment added" });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
