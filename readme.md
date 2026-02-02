# 🎟️ Smart Ticket Routing System

A Full-Stack **Ticket Management & Routing System** built using the **MERN Stack**.  
Users can raise tickets, and Admins can manage and resolve them via dashboards.

---

## 🚀 Live Links

Frontend: https://your-frontend.vercel.app  
Backend API: https://ticket-routing-system-backend.onrender.com

---

## ✨ Features

### User
- Register / Login
- Create Support Ticket
- View My Tickets
- Delete Ticket
- Mark Ticket as Resolved
- Ticket Statistics

### Admin
- Admin Dashboard
- View All Tickets
- Filter by Status / Priority / Search
- Resolve Tickets
- Role-based Access

### System
- JWT Authentication
- MongoDB Atlas Cloud DB
- Responsive UI (Ant Design)
- Automatic Category & Priority Assignment
- Queue Routing Logic

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Ant Design
- Axios / Fetch
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Bcrypt
- CORS

**Deployment**
- Frontend → Vercel
- Backend → Render

---

## 📁 Folder Structure

Ticket-Routing-System
│
├── backend
│ ├── src
│ │ ├── config
│ │ ├── controllers
│ │ ├── middleware
│ │ ├── models
│ │ ├── routes
│ │ ├── services
│ │ └── utils
│ └── server.js
│
├── frontend
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ ├── App.jsx
│ │ └── main.jsx
│
└── README.md

---

## 🔐 Authentication Flow

1. User registers → stored in MongoDB
2. User logs in → JWT generated
3. JWT stored in browser Local Storage
4. Protected routes validate token
5. Role decides dashboard access

---

## 🧠 Ticket Logic

- User submits Title + Description
- Category auto-assigned
- Priority auto-assigned
- Queue auto-assigned
- Admin resolves tickets

---

## ⚙️ Environment Variables (Backend)

Create `.env` in **backend/**


---

## 📦 API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Tickets
- POST `/api/tickets`
- GET `/api/tickets/my`
- GET `/api/tickets`
- PATCH `/api/tickets/:id/status`
- DELETE `/api/tickets/:id`

---

## 🔮 Future Improvements
- Email Notifications
- File Uploads
- Live Chat / Comments
- Analytics Dashboard
- OAuth Login

---

## 👨‍💻 Author
**Mohan Shyam Pandey**