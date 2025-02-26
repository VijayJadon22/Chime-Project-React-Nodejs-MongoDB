# Chime Full Stack Social Media Website

Chime is a full-stack social media application built using **React**, **Node.js**, **Express**, and **MongoDB**. It allows users to sign up, log in, create posts, follow other users, interact with posts, receive notifications, and much more. This project serves as a showcase for both front-end and back-end development skills. It is fully responsive, ensuring a smooth experience on both phones and laptops.

Deployed on **Render.com**, Chime is a perfect demonstration of building modern web applications using popular technologies.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Signup, login, logout with JWT-based authentication.
- **Profile Management**: Users can update their profile details, including profile and cover images.
- **Post Management**: Users can create, read, update, and delete posts.
- **Follow/Unfollow**: Users can follow/unfollow other users.
- **Post Interaction**: Users can like, comment, and view posts.
- **Notifications**: Users receive notifications for activities such as new followers, likes, or comments on posts.
- **Responsive Design**: The site is optimized for both desktop and mobile devices, providing a seamless user experience across all screen sizes.
- **Image Uploads**: Profile and cover images are uploaded via **Cloudinary**.


## Dependencies

### Backend

- **`bcryptjs`**: For hashing passwords.
- **`cloudinary`**: For image uploads.
- **`cookie-parser`**: For parsing cookies.
- **`cors`**: For enabling Cross-Origin Resource Sharing.
- **`dotenv`**: For loading environment variables.
- **`express`**: For building the web server.
- **`jsonwebtoken`**: For generating and verifying JWT tokens.
- **`mongoose`**: For interacting with MongoDB.

### Frontend

- **`@tanstack/react-query`**: For data fetching and caching.
- **`react`**: For building the user interface.
- **`react-dom`**: For rendering React components.
- **`react-hot-toast`**: For displaying notifications.
- **`react-icons`**: For using icons.
- **`react-router-dom`**: For routing.
- **`daisyui`**: For UI components.
- **`tailwindcss`**: For styling.
- **`vite`**: For building the frontend.


## API Endpoints

### Authentication

- **POST `/api/auth/signup`**: Sign up a new user.
- **POST `/api/auth/login`**: Log in a user.
- **POST `/api/auth/logout`**: Log out a user.
- **GET `/api/auth/me`**: Get the current logged-in user's information.

### Users

- **GET `/api/users/profile/:username`**: Get a user's profile by username.
- **GET `/api/users/suggested`**: Get suggested users to follow.
- **POST `/api/users/follow/:id`**: Follow or unfollow a user.
- **POST `/api/users/update`**: Update the current user's profile.

### Posts

- **GET `/api/posts/all`**: Get all posts.
- **GET `/api/posts/following`**: Get posts from users the authenticated user is following.
- **GET `/api/posts/user/:username`**: Get posts by a specific user.
- **GET `/api/posts/likes/:id`**: Get posts liked by a specific user.
- **POST `/api/posts/create`**: Create a new post.
- **POST `/api/posts/like/:id`**: Like or unlike a post.
- **POST `/api/posts/comment/:id`**: Comment on a post.
- **DELETE `/api/posts/:id`**: Delete a post by ID.

### Notifications

- **GET `/api/notifications/`**: Get notifications for the authenticated user.
- **DELETE `/api/notifications/`**: Delete all notifications for the authenticated user.
- **DELETE `/api/notifications/:id`**: Delete a single notification by its ID for the authenticated user.


## Environment Variables

Create a `.env` file in the root directory of the project to store the following variables:
#### MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/chime?retryWrites=true&w=majority

#### JWT secret key
JWT_SECRET=your_jwt_secret_key

#### Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

#### Other necessary environment variables
PORT=5000
NODE_ENV=development



## Project Structure

```plaintext
Chime/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── vite.config.js
├── .gitignore
├── package.json
└── README.md





