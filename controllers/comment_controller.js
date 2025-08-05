const Comment = require("../models/comment_model");
const formatDate = require("../utils/format_date.js");

// Add Comment to a post
exports.addComment = async (userId, { content, postId }) => {
  const comment = await Comment.create({
    content,
    author: userId,
    post: postId,
  });

  const result = comment.toObject();
  result.createdAt = formatDate(result.createdAt);

  return {
    success: true,
    message: "Comment added",
    data: result,
  };
};

// Get comments for a post
exports.getComments = async (postId) => {
  const comments = await Comment.find({ post: postId }).populate(
    "author",
    "username"
  );

  const result = comments.map((comment) => {
    const obj = comment.toObject();
    obj.createdAt = formatDate(obj.createdAt);
    return obj;
  });

  return {
    success: true,
    count: result.length,
    data: result,
  };
};

// Edit a comment
exports.editComment = async (commentId, userId, content) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");
  if (!comment.author.equals(userId)) throw new Error("Unauthorized");

  comment.content = content;
  await comment.save();

  const result = comment.toObject();
  result.createdAt = formatDate(result.createdAt);
  result.updatedAt = formatDate(result.updatedAt);

  return {
    success: true,
    message: "Comment updated",
    data: result,
  };
};

// Delete a comment
exports.deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");
  if (!comment.author.equals(userId)) throw new Error("Unauthorized");

  await comment.deleteOne();

  return {
    success: true,
    message: "Comment deleted",
  };
};

// Like or unlike a comment
exports.toggleLikeOnComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");

  const liked = comment.likes.includes(userId);
  if (liked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.push(userId);
  }

  await comment.save();

  const result = comment.toObject();
  result.createdAt = formatDate(result.createdAt);
  result.updatedAt = formatDate(result.updatedAt);

  return {
    success: true,
    message: liked ? "Unliked" : "Liked",
    data: result,
  };
};
