const router = require("express").Router();
const auth = require("../middlewares/auth_middleware");
const validate = require("../middlewares/validate_middleware");
const { body, param } = require("express-validator");

const {
  addComment,
  getComments,
  editComment,
  deleteComment,
  toggleLikeOnComment,
} = require("../controllers/comment_controller");

// Get comments for a post
router.get(
  "/:postId",
  [param("postId").isMongoId().withMessage("Invalid post ID")],
  validate,
  async (req, res, next) => {
    try {
      const response = await getComments(req.params.postId);
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

// Add a comment to a post
router.post(
  "/",
  auth,
  [
    body("postId").isMongoId().withMessage("Valid post ID is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const response = await addComment(req.user.id, req.body);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/comments/:id — Edit comment
router.put(
  "/:id",
  auth,
  [
    param("id").isMongoId().withMessage("Invalid comment ID"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const result = await editComment(
        req.params.id,
        req.user.id,
        req.body.content
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/comments/:id — Delete comment
router.delete(
  "/:id",
  auth,
  [param("id").isMongoId().withMessage("Invalid comment ID")],
  validate,
  async (req, res, next) => {
    try {
      const result = await deleteComment(req.params.id, req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/comments/:id/like — Toggle like/dislike
router.post(
  "/:id/like",
  auth,
  [param("id").isMongoId().withMessage("Invalid comment ID")],
  validate,
  async (req, res, next) => {
    try {
      const result = await toggleLikeOnComment(req.params.id, req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
