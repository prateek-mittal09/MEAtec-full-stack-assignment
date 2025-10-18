
A **fullstack task management app** with secure authentication and real-time task management features.

---

## 🚀 Features

### 🔐 User Authentication
- Secure registration and login using **JWT**  
- Password hashing with **bcrypt**  
- Protected API routes  
- Persistent sessions via **localStorage**

### ✅ Task Management
- Create, read, update, and delete tasks  
- Real-time **optimistic UI updates**  
- Task status tracking (**Pending / Completed**)  
- User-specific data isolation  

### 🎨 Modern UI/UX
- Responsive design with **TailwindCSS**  
- Duochrome theme with smooth animations  
- Real-time **form validation and feedback**

---

## 🛠️ Technology Stack

### **Frontend**
- **React 19** + **Vite**  
- **Redux Toolkit** – state management  
- **React Router** – navigation  
- **TailwindCSS** – styling  
- **Axios** – API communication  
- **React Hook Form + Zod** – validation  

### **Backend**
- **Next.js 15 (App Router)** with TypeScript  
- **Prisma ORM** + **MongoDB**  
- **JWT** for authentication  
- **bcryptjs** for password hashing  

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/IshaanMinocha/task-manager.git
cd task-manager
2. Backend Setup
bash
Copy code
cd server
npm install
Create a .env file in the server directory using .env.example.

Generate Prisma client and push the schema:

bash
Copy code
npm run prisma:generate
npm run db:push
3. Frontend Setup
bash
Copy code
cd ../client
npm install
Create a .env file in the client directory using .env.example.

4. Run the Application
Start Backend:

bash
Copy code
cd server
npm run dev
Backend available at → http://localhost:3000

Start Frontend:

bash
Copy code
cd client
npm run dev
Frontend available at → http://localhost:5173

📡 API Overview
🔑 Authentication
Register
POST /api/auth/register

json
Copy code
{
  "username": "john_doe",
  "password": "password123"
}
Login
POST /api/auth/login

json
Copy code
{
  "username": "john_doe",
  "password": "password123"
}
🗂️ Tasks (Protected – Requires JWT)
Include your JWT token in headers:

makefile
Copy code
Authorization: Bearer <token>
Get All Tasks
GET /api/tasks

Create Task
POST /api/tasks

json
Copy code
{
  "title": "New Task",
  "description": "Optional description",
  "status": "PENDING"
}
Update Task
PUT /api/tasks/:id

Delete Task
DELETE /api/tasks/:id
