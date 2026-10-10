# Portfolio Backend API

Express.js REST API with **PostgreSQL (pgAdmin 14)** and **MongoDB** database support for Chinmay Wadhwa's portfolio.

## Architecture

```
backend/
├── config/
│   └── db.js                 # PostgreSQL Pool & database connection
├── controllers/
│   └── contactController.js  # Contact form controller & business logic
├── models/
│   └── ContactMessage.sql    # PostgreSQL schema table definition
├── routes/
│   ├── contactRoutes.js      # /api/contact endpoints
│   └── healthRoutes.js       # /api/health check
├── server.js                 # Express application entry point
├── package.json              # Backend dependencies
└── .env.example              # Environment variables template
```

## Setup & Running

1. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure PostgreSQL in `.env`**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide your local PostgreSQL / pgAdmin 14 credentials:
   ```env
   PORT=5000
   PG_HOST=localhost
   PG_PORT=5432
   PG_DATABASE=portfolio_db
   PG_USER=postgres
   PG_PASSWORD=your_password
   ```

3. **Start the backend server**:
   From the project root:
   ```bash
   npm run server:dev
   ```
   Or from `backend/`:
   ```bash
   npm run dev
   ```

4. **API Endpoints**:
   - `GET http://localhost:5000/api/health` — Checks server and PostgreSQL connection status.
   - `POST http://localhost:5000/api/contact` — Saves contact messages directly to the PostgreSQL `contact_messages` table (viewable inside pgAdmin 14).
   - `GET http://localhost:5000/api/contact/messages` — Lists all submitted messages.
