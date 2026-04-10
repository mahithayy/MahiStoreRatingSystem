# StoreRater - Full-Stack Rating System

A robust, role-based store rating platform built with React, Express, PostgreSQL, and Prisma. This application allows users to discover and rate stores, store owners to view their analytics, and administrators to manage the entire ecosystem.

##  Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons, React Router
* **Backend:** Node.js, Express.js, Prisma ORM
* **Database:** PostgreSQL (Hosted on Neon)
* **Authentication:** JSON Web Tokens (JWT), bcryptjs

##  Key Features
* **Role-Based Access Control:** Three distinct user types (`ADMIN`, `STORE_OWNER`, `USER`) with secure protected routes.(All users can update password by clicking on "Profile" button in Navbar)
* **Strict Validation:** Enforced Zod validation for user creation (names 20-60 chars, strict password policies).
* **Interactive Dashboards:** * Admins can view platform stats, filter users, sort tables, and dynamically assign stores.
  * Store Owners get real-time analytics on their average ratings and recent reviews.
* **Upsert Ratings:** Users can seamlessly submit or update their ratings (1-5 stars) for any store.

##  Local Setup Instructions
For using the deployed versions, no setup needed. They're fully functional on their own.
### Prerequisites
* Node.js (v18+)
* PostgreSQL (Local or Cloud like Neon/Supabase)

### Backend Setup
1. `cd backend`
2. Run `npm install`
3. Create a `.env` file based on the provided `.env.example` (Requires `DATABASE_URL`, `JWT_SECRET`, `PORT`).
4. Run `npx prisma db push` to sync the database schema.
5. Run `npm run dev` to start the server.

### Frontend Setup
1. `cd frontend`
2. Run `npm install`
3. Create a `.env` file and add `VITE_API_BASE_URL=http://localhost:3001/api`
4. Run `npm run dev` to start the Vite development server.

##  Default Admin Access
To access the Admin dashboard on a fresh database installation:
1. Register a new account via the frontend signup page.
2. Run the following SQL command in your database to elevate permissions:
   `UPDATE "User" SET role = 'ADMIN' WHERE email = 'your_email@example.com';
