# Mindforge — Fullstack Blog

A fullstack blogging application ("Blog") built with React + Vite (client) and Node.js + Express (server). It features public blog listings, moments (short posts), an admin dashboard for managing blogs and comments, image uploads via ImageKit, and JWT-based admin authentication.

---

## Table of Contents

- [Demo / Overview](#demo--overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
  - [Install dependencies](#install-dependencies)
  - [Run server](#run-server)
  - [Run client](#run-client)
  - [Run both (development)](#run-both-development)
- [Build for production](#build-for-production)
- [API endpoints (summary)](#api-endpoints-summary)
- [Admin account / authentication](#admin-account--authentication)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Demo / Overview

This project provides a simple blogging platform with:

- Public-facing pages for listing blogs and a Moments section.
- Admin area for adding, editing, deleting blogs and moderating comments.
- Image uploads (ImageKit) for blog images and moments.
- JWT-based authentication for admin routes.

The repo name is: `Mindforge-Forging-ideas-with-Artificial-intelligence` — this codebase contains the Blog project inside.

## Features

- View all blogs and moments
- Create/update/delete blogs (admin)
- Add/delete moments (admin)
- Commenting system with moderation approvals (admin)
- Image uploads integrated with ImageKit
- Admin authentication using email/password + JWT

## Tech Stack

- Client: React (v19), Vite, Tailwind CSS, Axios, React Router
- Server: Node.js, Express, Mongoose (MongoDB), ImageKit, JWT
- Dev tools: nodemon (server), Vite dev server (client)

Key dependencies (excerpt):
- Client: `axios`, `react`, `react-dom`, `react-router-dom`, `tailwindcss`, `vite`
- Server: `express`, `mongoose`, `imagekit`, `jsonwebtoken`, `multer`, `dotenv`

## Repository Structure

Top-level folders:

- `client/` — React front-end (Vite). Contains `src/`, `public/`, etc.
- `server/` — Express backend. Contains `routes/`, `controllers/`, `models/`, `configs/`.

Important files:
- `client/package.json` — client scripts and dependencies.
- `server/package.json` — server scripts and dependencies.
- `server/configs/db.js` — connects to MongoDB using `process.env.MONGODB_URI`.
- `server/configs/imageKit.js` — ImageKit client configured via env vars.

## Prerequisites

- Node.js (v18+ recommended)
- npm (or yarn)
- A MongoDB instance (Atlas or local)
- ImageKit account (optional; required if using image upload)

## Environment Variables

Create `.env` files for server and optionally for client.

Server (`server/.env`):

- `PORT` — Port the server listens on (e.g., `5000`) (optional).
- `MONGODB_URI` — MongoDB connection string (required).
- `IMAGEKIT_PUBLIC_KEY` — ImageKit public key (required for uploads).
- `IMAGEKIT_PRIVATE_KEY` — ImageKit private key (required for uploads).
- `IMAGEKIT_URL_ENDPOINT` — ImageKit URL endpoint.
- `JWT_SECRET` — Secret used to sign JWTs (required for admin auth).
- `ADMIN_EMAIL` — Admin email used for admin login.
- `ADMIN_PASSWORD` — Admin password used for admin login.

Client (`client/.env`):

- `VITE_BASE_URL` — Base URL for API calls (e.g., `http://localhost:5000`)

Notes:
- The server will check for `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` at login. If these are missing, admin login returns a configuration error.
- The client reads `VITE_BASE_URL` (used in `client/context/AppContext.jsx`).

## Local Setup

Open two terminals (PowerShell recommended on Windows) and run the client and server separately.

1) Install dependencies

```powershell
# from repo root
cd client; npm install
cd ..\server; npm install
```

2) Run the server (development)

```powershell
# in one terminal
cd server
npm run server      # runs nodemon server.js (dev)
# OR (production-like)
npm start            # runs node server.js
```

3) Run the client (development)

```powershell
# in another terminal
cd client
npm run dev         # starts Vite dev server (hot-reload)
```

4) Access the app

- Client: typically http://localhost:5173 (Vite default) — the console will show the port.
- Server: http://localhost:5000 (or the `PORT` you set).

Run both concurrently

- This project does not yet include a top-level script to run both together. Open two shells as shown above. If you prefer a single command, consider adding `concurrently` as a dev dependency & a script like `dev` that runs both.

## Build for production

Build client:

```powershell
cd client
npm run build
# The built assets are in client/dist (Vite default). Serve them from a static server, or configure the Express server to serve these assets in production.
```

Start production server:

```powershell
cd server
npm start
```

## API endpoints (summary)

The backend exposes routes under `/api` for blogs, moments, and admin. Some admin routes are protected and require a `Bearer <token>` header.

Notable routes (review `server/routes/` for the full list):

- `POST /api/admin/login` — Admin login (body: `{ email, password }`) -> returns `{ token, user }`.
- `GET /api/admin/dashboard` — Protected; returns admin dashboard data.
- `GET /api/blog/all` — Public: fetch all blogs.
- `GET /api/moments` — Public: fetch moments.
- `POST /api/moments` — Protected: create a moment (multipart/form-data file `image`).
- `DELETE /api/moments/:id` — Protected: delete a moment.

## Admin account / authentication

Admin login is driven by environment variables. To enable admin login, set:

- `ADMIN_EMAIL` — admin@example.com (example)
- `ADMIN_PASSWORD` — a secure password
- `JWT_SECRET` — secret used to sign tokens

The server will validate the credentials against these env vars and return a JWT on success. Use this JWT in the `Authorization: Bearer <token>` header for protected admin requests.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/some-feature`.
3. Make changes and add tests where applicable.
4. Open a pull request with a clear description and testing steps.

Please follow the code style already used in the project. When adding features that require new environment variables, update this README accordingly.

## Troubleshooting

- If the client throws errors related to `VITE_BASE_URL`, ensure the client `.env` contains the correct server URL.
- If admin login fails with `Server configuration error`, verify `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` are present in `server/.env`.
- MongoDB connection issues: ensure `MONGODB_URI` is valid and reachable.

## License

This repository does not specify a license in `package.json`. Add an appropriate `LICENSE` file and update this section as needed.

---

If you want, I can:

- Add example `.env.example` files for `client` and `server`.
- Add a `dev` script that runs both client and server with `concurrently`.
- Add a simple deployment guide (e.g., Docker or Vercel + Heroku/Render) — tell me which target you'd prefer.

Created: November 13, 2025
