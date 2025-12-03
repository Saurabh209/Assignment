# 🗂️ Assignment – TaskForge

### 🔗 Live Link
> *([Click Me 🥹](https://assignment-3l39.vercel.app/))*

### 🎥 Demo Video
> *([Click to see Demo](https://res.cloudinary.com/doeiccxm7/video/upload/v1764680588/unrecord_okgmgg.mp4))*




Welcome,
This isn't your casual to-do list app. **TaskForge** is a full-stack kanban-style task management system where every board is its own battlefield, and tasks are the bosses waiting to be slain. Manage, create, update, delete — do whatever it takes to survive the sprint.

---

## ⚔️ Core Features

### 🧱 Boards
- Create unlimited boards (projects / modules / arcs)
- Each board has its **own independent tasks & workflow**
- Delete boards when the journey ends (RIP fallen warriors)

### 📌 Tasks
Each task has:
- **Title**
- **Description**
- **Priority** (Low / Medium / High)
- **Status** (To Do / In Progress / Done)
- **Assigned User**
- Dynamic background colors based on status/priority

### 🔄 Task Actions
- Create new tasks inside any board
- Update existing tasks via pre-filled modal form
- Delete tasks
- Real-time UI refresh after every action

### 🚀 Backend & API
- Node.js + Express + MongoDB
- REST API structure
- Endpoints for CRUD on Boards & Tasks
- Mongoose models with auto validation

### 📡 Frontend Features
- React + Axios + Context API
- Modal based add/update forms
- Smooth conditional rendering
- Proper state handling for both Add & Update modes
- Loading and error handling

---

## 🌐 API Endpoints (Quick Reference)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/boards` | Create new board |
| GET | `/boards` | Get all boards |
| DELETE | `/boards/:id` | Delete a board |
| POST | `/boards/:id/tasks` | Create task in a board |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

---

## 🧠 Tech Stack

### **Frontend**
- React
- Axios
- Context API / State Hooks
- SCSS
- Vercel Deployment

### **Backend**
- Node.js
- Express
- MongoDB + Mongoose


---

## 📦 Installation & Setup

```bash
git clone <repo-url>
cd project-folder
npm install
npm run dev
