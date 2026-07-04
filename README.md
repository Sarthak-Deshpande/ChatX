# ChatX 🤖

A full-stack AI chat assistant built with the MERN stack and OpenRouter API.

## Features
- 💬 Persistent conversations with thread history
- 🔐 JWT Authentication (Register/Login)
- 🧠 AI-powered responses via OpenRouter
- 💻 Code syntax highlighting
- 👤 User-scoped chat threads
- ⚡ Real-time typing indicator

## Tech Stack
**Frontend:** React, Vite, Context API, React Router DOM  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Auth:** JWT, bcryptjs  
**AI:** OpenRouter API (OpenAI-compatible)  

## Setup

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_key
PORT=3000
```

```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure
```
ChatX/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
└── frontend/
    └── src/
        ├── pages/
        ├── MyContext.jsx
        ├── Sidebar.jsx
        ├── ChatWindow.jsx
        └── App.jsx
```