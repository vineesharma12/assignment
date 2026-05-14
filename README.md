# Team Task Manager

A production-ready full-stack Team Task Manager for project collaboration, task assignment, status tracking, team visibility, and dashboard analytics.

## Features

- JWT authentication with persistent login
- Admin and Member role-based access control
- Project CRUD with team member assignment
- Task CRUD, assignee management, filters, search, comments, and pagination-ready API
- Members can update only their own assigned task status
- Dashboard analytics with Recharts
- Overdue task tracking and recent activity feed
- Responsive React + Tailwind CSS interface
- Railway-ready backend and frontend configuration

## Tech Stack

Frontend: React.js, Vite, React Router DOM, Tailwind CSS, Axios, React Context API, Recharts, React Hot Toast.

Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, express-validator, Helmet, CORS.

## Project Structure

```text
backend/
  config/ controllers/ middleware/ models/ routes/ utils/ validations/
  server.js
  srcApp.js
frontend/
  src/api src/components src/context src/layouts src/pages src/utils
```

## Installation

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

Backend `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team_task_manager
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Projects:

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`

Tasks:

- `GET /api/tasks?status=&priority=&search=&page=&limit=`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/comments`

Dashboard:

- `GET /api/dashboard/stats`

Users:

- `GET /api/users`
- `PUT /api/users/profile`

## Role Permissions

Admin users can create, edit, and delete projects and tasks, manage team members, assign tasks, change any task status, and view all tasks.

Member users can view assigned projects and tasks, and update the status of their own assigned tasks only.

## Railway Deployment

Backend:

1. Create a Railway service from the `backend` folder.
2. Add `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and optional `PORT`.
3. Railway uses `npm start`, which runs `node server.js`.

Frontend:

1. Create a Railway service from the `frontend` folder.
2. Set `VITE_API_URL` to your deployed backend URL plus `/api`.
3. Build command: `npm run build`.
4. Start command: `npm run preview`.

## Demo

Add your deployed Railway links here:

- Frontend:
- Backend health check:

## Screenshots

Add screenshots of:

- Login
- Dashboard
- Projects
- Tasks
- Team members

## Assignment Notes

This repository is structured for GitHub submission with clean separation between frontend and backend, environment variable support, production build scripts, and scalable MVC-style backend architecture.
