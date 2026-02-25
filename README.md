# WSC Demo Lab

WSC Demo Lab is an intentionally vulnerable web security lab for educational cybersecurity demonstrations.

## Project Overview
This project simulates a simple project voting application with JWT-based admin access. It is intentionally designed with security flaws to support training, demos, and controlled testing.

## Features
- Node.js + Express backend
- JSON file storage (no database)
- JWT authentication for admin access
- Public voting endpoint
- Plain HTML + Vanilla JavaScript frontend
- Dark theme UI with glassmorphism cards
- Render-ready deployment setup

## Intentional Vulnerabilities
1. Weak JWT secret (`wsc_weak_secret`)
2. Public debug endpoint: `GET /api/debug/config`
3. Plaintext password storage in `data/users.json`
4. No server-side validation in `POST /api/vote`
5. Voting disable control enforced only on frontend

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env
   ```
3. Start server:
   ```bash
   npm start
   ```
4. Open:
   - `http://localhost:3000/`
   - `http://localhost:3000/vote.html`
   - `http://localhost:3000/admin.html`

## Render Deployment
1. Push this project to a Git repository.
2. In Render, create a new **Web Service** and connect the repo.
3. Configure service:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables (optional for this demo):
   - `PORT` (Render provides automatically)
5. Deploy.

## Default Admin Credentials
- Email: `admin@wsc.local`
- Password: `SuperSecret123`

## Disclaimer
"This lab is intentionally vulnerable and is for educational purposes only."