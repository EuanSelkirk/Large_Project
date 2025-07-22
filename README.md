# Resume Builder

This project is a full-stack web application using:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + React Router
- **Server**: Express.js + MongoDB + Mongoose + Node.js
- **Testing Tool**: Postman

---

## 📦 Prerequisites

- [Node.js & npm](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Postman](https://www.postman.com/downloads/)

---

## 📁 Project Structure

```
/Large_Project
│
├── /frontend      → React + Vite + Tailwind app
└── /server        → Express + MongoDB API
```

## 🌐 Website Layout

- **Home Page** – introduction with links to log in or register.
- **Dashboard** – lists your saved resumes with options to add or delete.
- **Editor** – VSCode-inspired editor with live preview and PDF export.
- **Profile** – shows your username and provides a logout button.

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/13isgreen/Large_Project.git
cd Large_Project
```

---

### 2. Backend Setup (`/server`)

```bash
cd server
npm install
```

#### 🛠 Create `.env` file

```env
MONGO_URI=mongodb://localhost:27017/largeprojectserver
PORT=5174
EMAIL_USER=<your_email>
EMAIL_PASS=<your_app_password>
JWT_SECRET=<your_secret>
```

#### ▶️ Start Backend

```bash
node server.js
```

Backend will run at: [http://localhost:5174](http://localhost:5174)

---

### 3. Frontend Setup (`/frontend`)

```bash
cd ../frontend
npm install
```

#### ▶️ Start Frontend

```bash
npm run dev
```

Frontend will run at: [http://localhost:5173](http://localhost:5173)

---

## 🧪 API Testing with Postman

Download Postman here: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

### Example: POST request to create a user

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/users`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body (JSON)**:
  ```json
  {
    "name": "Test User",
    "email": "test@example.com"
  }
  ```

---

## 📝 Notes

- Tailwind CSS is fully integrated in the frontend.

---

## 📚 License

This project is for educational purposes.
