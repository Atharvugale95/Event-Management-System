# 🎉 Event Registration System

A full-stack Event Registration System built using **React + Vite** for the frontend and **FastAPI + SQLite** for the backend.

This project allows users to:
- Register and Login
- Register for events
- View success confirmation
- Use AI chatbot support
- Experience a modern responsive UI

---

# 🚀 Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- CSS

## Backend
- FastAPI
- SQLAlchemy
- SQLite

## AI / Automation
- Make.com Webhooks
- AI Chatbot Integration

---

# ✨ Features

- 🔐 Simple Authentication System
- 📝 Event Registration Form
- 🎨 Professional UI Design
- 🤖 AI Chatbot Assistant
- ⚡ FastAPI REST APIs
- 🗄️ SQLite Database
- ✅ Registration Success Page

---

# 📂 Project Structure

```bash
event-registration/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── registrations.db
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Backend Setup

## Step 1: Go to backend folder

```bash
cd backend
```

## Step 2: Install dependencies

```bash
pip install fastapi uvicorn sqlalchemy
```

## Step 3: Run backend server

```bash
uvicorn main:app --reload
```

Backend runs on:

```bash
http://localhost:8000
```

Swagger API Docs:

```bash
http://localhost:8000/docs
```

---

# 💻 Frontend Setup

## Step 1: Go to frontend folder

```bash
cd frontend
```

## Step 2: Install dependencies

```bash
npm install
```

## Step 3: Start React app

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Test API |
| POST | `/register-user` | Register User |
| POST | `/login-user` | Login User |
| POST | `/register` | Register for Event |
| GET | `/registrations` | Get All Registrations |

---

# 🤖 Chatbot Integration

The chatbot is integrated using:
- Make.com Webhooks
- AI Automation Workflow

Features:
- Event Information
- Registration Help
- Venue Details
- Fee Details
- User Support

---

# 📸 Screenshots

Add screenshots inside:

```bash
screenshots/
```

Example screenshots:
- Home Page
- Login Page
- Registration Form
- Success Page
- Chatbot UI

---

# 📌 Future Improvements

- Admin Dashboard
- Event Management Panel
- Payment Gateway
- Email Notifications
- JWT Authentication
- AI Event Recommendations

---

# 👨‍💻 Author

Atharv Ugale

GitHub: https://github.com/goldenknights95

LinkedIn: https://linkedin.com/in/atharv-ugale-22a22b255

---

# 📜 License

This project is for educational and learning purposes.
