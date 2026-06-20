# 📌 PinIt — Community Notice Board Platform

PinIt is a full-stack community notice board application where users can post announcements, lost & found items, events, and team-finding opportunities.

The platform allows communities to share information, interact with posts, receive notifications, and connect with other users.

🌐 **Live Demo:** https://pinit-lyart.vercel.app/

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Protected routes and APIs
- User-specific actions

---

### 📢 Notice Management

Users can:

- Create notices
- View community notices
- Delete their own notices
- Browse posts by category

Supported categories:

- Lost & Found
- Events
- Team Finder

---

### ❤️ Community Interaction

- Upvote notices
- Reply to Lost & Found posts
- Contact users directly
- Share notices through WhatsApp

---

### 👥 Team Finder System

Users can create team-building posts for events.

Features:

- Specify event details
- Mention required roles
- Users can express interest
- Notice owners can view interested users
- Direct contact option

---

### 🔔 Notification System

Users receive notifications for:

- New replies
- Team interest requests

Includes:

- Notification dropdown
- Unread notification count
- Mark as read functionality

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication

### Database

- PostgreSQL

### Deployment

- Frontend → Vercel
- Backend → Render
- Database → Render PostgreSQL

---

## 🏗️ Application Architecture

```
                React Frontend
                       |
                       |
                 Axios Requests
                       |
                       v
                Express Backend
                       |
          -------------------------
          |                       |
          v                       v
   JWT Authentication       API Controllers
                                  |
                                  v
                         PostgreSQL Database
```

---

## 📂 Project Structure

```
PinIt/

├── frontend/
│
│   ├── src/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── NoticeCard.jsx
│   │   ├── ReplyModal.jsx
│   │   └── ShareModal.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   └── MyNotices.jsx
│   │
│   └── App.jsx
│
│
├── backend/
│
│   ├── src/
│   │
│   ├── controllers/
│   │   └── noticeController.js
│   │
│   ├── routes/
│   │   └── noticeRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── migrate.js
│   │
│   └── server.js
│
└── README.md
```

---

## 🔑 Authentication Flow

1. User registers
2. Password is encrypted using bcrypt
3. User logs in
4. Backend generates JWT token
5. Token is stored on client
6. Protected API requests send:

```
Authorization: Bearer <token>
```

7. Middleware verifies the token before allowing access

---

## 🗄️ Database Design

Main tables:

```
users
 |
 |
notices
 |
 +----------------+
 |                |
 v                v
upvotes      notice_replies
 |
 v
team_interests

notifications
```

Database includes:

- User management
- Notice storage
- Upvote tracking
- Reply management
- Interest tracking
- Notification system

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone <repository-url>

cd PinIt
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## Backend Setup

```bash
cd backend

npm install

npm start
```

Create `.env`

```env
PORT=5000

DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name

JWT_SECRET=your_secret_key
```

---

## 📡 API Overview

### Authentication

```
POST /api/auth/register

POST /api/auth/login
```

---

### Notices

```
GET    /api/notices

POST   /api/notices

GET    /api/notices/:id

DELETE /api/notices/:id
```

---

### Interactions

```
POST /api/notices/:id/upvote

POST /api/notices/:id/interest

GET /api/notices/:id/interests

POST /api/notices/:id/reply

GET /api/notices/:id/replies
```

---

### Notifications

```
GET /api/notices/notifications/all

PATCH /api/notices/notifications/:id/read
```

---

## 🔒 Security Implemented

- JWT authentication
- Password hashing
- Protected routes
- Authorization checks
- User ownership validation
- CORS configuration
- Secure database queries

---

## 🌱 Future Improvements

- Real-time notifications using WebSockets
- Image upload support
- Advanced search and filtering
- Mobile application
- Admin dashboard
- AI-based notice recommendations

---

## 👨‍💻 Author

**Rahul**

Full Stack Developer | AI Enthusiast

---

⭐ Built with React, Express and PostgreSQL
