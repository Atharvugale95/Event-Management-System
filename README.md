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
- N8N Webhooks
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
- N8N Webhooks
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
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8529f485-ad72-4131-b129-f80e4c60b439" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/00be0aa4-862b-4123-b7a6-f13f542d7110" />
<img width="950" height="5395" alt="localhost_5173_ (1)" src="https://github.com/user-attachments/assets/0f78e4fc-7e02-435b-894f-2642e89ad2e3" />
<img width="1056" height="1550" alt="localhost_5173_events_2_register" src="https://github.com/user-attachments/assets/e1191c15-71d9-451b-a7ab-4bbf1fa58435" />
<img width="1572" height="711" alt="image" src="https://github.com/user-attachments/assets/65e804c7-d06c-4189-b797-e37ff603ba5f" />

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
- AI Event Recommendations

---

# 👨‍💻 Author

Atharv Ugale

GitHub: https://github.com/Atharvugale95

LinkedIn: https://linkedin.com/in/atharv-ugale-22a22b255

---

# 📜 License

This project is for educational and learning purposes.
