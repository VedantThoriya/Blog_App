const Post = require("../models/post_model");
const formatDate = require("../utils/format_date.js");

// Create a new post
exports.createPost = async (title, content, uid) => {
  try {
    const post = await Post.create({
      title: title,
      content: content,
      author: uid,
    });
    return post;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single post by ID with author details
exports.getAggregatedPosts = async () => {
  const posts = await Post.aggregate([
    // Join with users
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },

    // Count number of comments
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $addFields: {
        commentCount: { $size: "$comments" },
        likeCount: { $size: "$likes" },
      },
    },

    // Project needed fields only
    {
      $project: {
        title: 1,
        content: 1,
        "author._id": 1,
        "author.username": 1,
        "author.email": 1,
        commentCount: 1,
        likeCount: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },

    // Sort latest first
    {
      $sort: { createdAt: -1 },
    },
  ]);

  // Format date
  return posts.map((post) => ({
    ...post,
    createdAt: formatDate(post.createdAt),
    updatedAt: formatDate(post.updatedAt),
  }));
};

// Like or unlike a post
exports.likePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  const liked = post.likes.includes(userId);

  if (liked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();

  const result = post.toObject();
  result.createdAt = formatDate(result.createdAt);
  result.updatedAt = formatDate(result.updatedAt);

  return {
    success: true,
    message: liked ? "Unliked" : "Liked",
    data: result,
  };
};

// Edit a post
exports.editPost = async (postId, userId, body) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (!post.author.equals(userId)) throw new Error("Unauthorized");

  post.title = body.title || post.title;
  post.content = body.content || post.content;

  await post.save();

  const result = post.toObject();
  result.createdAt = formatDate(result.createdAt);
  result.updatedAt = formatDate(result.updatedAt);

  return {
    success: true,
    message: "Post updated",
    data: result,
  };
};

// Delete a post
exports.deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (!post.author.equals(userId)) throw new Error("Unauthorized");

  await post.deleteOne();

  return {
    success: true,
    message: "Post deleted",
  };
};
