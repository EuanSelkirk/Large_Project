# Large Project

This project is a full-stack web application using:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + React Router
- **Backend**: Express.js + MongoDB + Mongoose + Node.js
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
└── /backend       → Express + MongoDB API
```

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/13isgreen/Large_Project.git
cd Large_Project
```

---

### 2. Backend Setup (`/backend`)

```bash
cd backend
npm install
```

#### 🛠 Create `.env` file

```env
MONGO_URI=mongodb://localhost:27017/myproject
PORT=3000
```

#### ▶️ Start Backend

```bash
npm run dev
# or if not using nodemon:
node index.js
```

Your backend will run at: [http://localhost:3000](http://localhost:3000)

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
- MongoDB must be running locally on port `27017`, or update the URI in `.env`.
- Be sure to add `.env` to your `.gitignore`.

---

## 📚 License

This project is for educational purposes.
