# 📝 Blog Platform Backend

A full-featured REST API for a blogging platform built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.

---

## 🚀 Features

### ✅ Authentication
- User Signup & Login with JWT
- Passwords hashed using bcrypt
- Protected routes using JWT middleware

### ✅ Posts
- Create, Edit, and Delete posts (Author only)
- Get all posts (with author info)
- Like/Unlike (toggle) posts
- Get posts with MongoDB aggregation:
  - Author info
  - Number of comments
  - Number of likes
  - ✅ **Aggregation used on `/api/posts/aggregate`**

### ✅ Comments
- Add, Edit, Delete comments on posts
- Like/Unlike (toggle) comments
- Get all comments for a post
- Authorization enforced (only author can edit/delete)

### ✅ Other Features
- MongoDB Atlas integration
- Clean and modular architecture
- Centralized error handler
- Express-validator for input validation
- Formatted timestamps in all responses

---

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- bcryptjs
- express-validator
- dotenv, morgan, cors

---

## 🧪 API Endpoints (Summary)

### Auth
| Method | Route           | Description       |
|--------|------------------|------------------|
| POST   | `/api/auth/signup` | Register new user |
| POST   | `/api/auth/login`  | Login and get token |

### Posts
| Method | Route                     | Description       |
|--------|----------------------------|------------------|
| GET    | `/api/posts`              | Get all posts |
| GET    | `/api/posts/aggregate`    | Get posts with likes & comments count |
| POST   | `/api/posts`              | Create post |
| PUT    | `/api/posts/:id`          | Edit post |
| DELETE | `/api/posts/:id`          | Delete post |
| POST   | `/api/posts/:id/like`     | Toggle like/unlike |

### Comments
| Method | Route                     | Description       |
|--------|---------------------------|------------------|
| GET    | `/api/comments/:postId`   | Get comments for post |
| POST   | `/api/comments`           | Add comment |
| PUT    | `/api/comments/:id`       | Edit comment |
| DELETE | `/api/comments/:id`       | Delete comment |
| POST   | `/api/comments/:id/like`  | Toggle like/unlike |

---

## 🛠️ Installation

```bash
git clone https://github.com/your-username/blog-platform-backend.git
cd blog-platform-backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
```

Start the server:

```bash
npm start
```

---

## ✅ Deployment Ready

This backend can be deployed on:
- Render
- Railway
- Cyclic
- Fly.io
- Your own VPS

---

## 👨‍💻 Author

Made by **Vedant Thoriya** as part of a Node.js Internship Assignment.

---

## 📄 License

This project is open-source and free to use.