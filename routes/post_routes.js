const router = require("express").Router();
const { body, param } = require("express-validator");
const auth = require("../middlewares/auth_middleware");
const validate = require("../middlewares/validate_middleware");

const {
  createPost,
  likePost,
  getAggregatedPosts,
  editPost,
  deletePost,
} = require("../controllers/post_controller");

// Public: Get all posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await getAggregatedPosts();
    res.json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    next(err);
  }
});

// Protected: Create a post
router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.id;

      const post = await createPost(title, content, userId);
      res
        .status(201)
        .json({ success: true, message: "Post created", data: post });
    } catch (err) {
      next(err);
    }
  }
);

// Protected: Toggle like
router.post(
  "/:id/like",
  auth,
  [param("id").isMongoId().withMessage("Invalid post ID")],
  validate,
  async (req, res, next) => {
    try {
      const postId = req.params.id;
      const userId = req.user.id;

      const result = await likePost(postId, userId);
      res.json({ success: true, message: result.message, data: result.post });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/posts/:id — Edit post
router.put(
  "/:id",
  auth,
  [
    param("id").isMongoId().withMessage("Invalid post ID"),
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("content")
      .optional()
      .notEmpty()
      .withMessage("Content cannot be empty"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const result = await editPost(req.params.id, req.user.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/posts/:id — Delete post
router.delete(
  "/:id",
  auth,
  [param("id").isMongoId().withMessage("Invalid post ID")],
  validate,
  async (req, res, next) => {
    try {
      const result = await deletePost(req.params.id, req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
