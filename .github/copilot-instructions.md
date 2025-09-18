## Quick orientation

This repository contains a small full-stack web app called PrivacyShield with two main folders:

- `backend/` — Node.js + Express server, MongoDB (mongoose). Key files: `index.js` (routes, server start), `db.js` (mongoose connect), `controllers/`, `routes/`, `models/`.
- `frontend/privacyshield/` — React (Vite) single-page app. Key files: `src/App.jsx` (routing + axios interceptor), `src/main.jsx`.

Keep changes minimal and local. The app runs as two processes: the backend (node) and the frontend (vite). Environment values are provided via `.env` and Vite env vars (`VITE_BACKEND_URI`).

## How to run (developer flows)

- Backend (from `backend/`):

  - Install: `npm install`
  - Start: `npm start` (runs `node index.js`). Development may prefer `nodemon` — project has it as a dependency.
  - DB: `backend/db.js` reads `process.env.MONGO_URI`. Ensure MongoDB is reachable and `JWT_SECRET` is set for auth routes.

- Frontend (from `frontend/privacyshield/`):
  - Install: `npm install`
  - Start dev server: `npm run dev` (Vite)
  - Build: `npm run build`
  - The frontend reads `VITE_BACKEND_URI` (used by `src/App.jsx` and `src/services/adminApi.js`). In dev, set it to the backend address (e.g. `http://localhost:8000`).

## Architectural notes & patterns

- API prefix: backend admin endpoints live under `/api/admin` (see `backend/routes/admin.js`). Other endpoints include `/question` and `/assesment`.
- Auth: JWT-based admin auth implemented in `backend/middleware/adminAuth.js`. Tokens are expected in the `Authorization: Bearer <token>` header. The frontend stores tokens in `localStorage` and sends them via `adminApi` or the axios interceptor.
- DB: Mongoose models live in `backend/models/`. Password hashing is handled by `bcryptjs` in `adminUser.js` pre-save hooks.
- Frontend network behavior: `src/App.jsx` sets an axios request interceptor to prepend `VITE_BACKEND_URI` to relative URLs. Some modules use raw `fetch` with `import.meta.env.VITE_BACKEND_URI` (see `src/services/adminApi.js`).

## Project-specific conventions

- Routes and controllers: the backend separates `routes/` (express routing) and `controllers/` (business logic) — follow that split for new endpoints.
- Models: Mongoose schemas are in `backend/models/` and exported as the collection name (lowercase). Use `createIndexes()` if adding unique fields.
- Frontend: React components are organized under `src/components/`, and admin auth context lives in `src/context/AdminAuthContext.jsx` (use it for protected UI).
- Environment vars: backend uses `process.env.*`; frontend uses `VITE_` prefixed vars consumed via `import.meta.env`.

## Integration gotchas & examples

- When adding backend routes consumed by the frontend, register them in `index.js` and call them under the same base used in `VITE_BACKEND_URI` (the frontend will prepend it).
- Example: Admin login flow
  - Frontend: `src/services/adminApi.js` POSTs to `/api/admin/login` and stores token in localStorage.
  - Backend: `backend/controllers/adminController.js` validates credentials and returns `{ token, admin }`.
  - Protected backend routes require `adminAuth` middleware and a `Bearer <token>` header.

## Typical change guidelines for AI edits

- Keep API surface stable. If adding fields to models, add migration notes and update callers in `controllers/` and frontend services.
- Preserve existing folder split (routes/controllers/models) and mirror changes in `frontend/src/services` where applicable.
- Tests: the repo currently has no automated tests. If you add tests, place backend tests under `backend/tests/` and frontend tests under `frontend/privacyshield/tests/`.

## Files to inspect for tasks / examples

- backend/index.js — server entry, route mounting, session config
- backend/db.js — mongoose connect
- backend/routes/admin.js & backend/controllers/adminController.js — login/verify examples
- backend/middleware/adminAuth.js — JWT verification pattern
- backend/models/adminUser.js — bcrypt hashing pattern
- frontend/privacyshield/src/App.jsx — axios interceptor and routing
- frontend/privacyshield/src/services/adminApi.js — fetch-based examples, token usage

## When in doubt

- Run the app locally (backend + frontend) and reproduce the issue, because environment values (MONGO_URI, JWT_SECRET, VITE_BACKEND_URI) control most runtime behavior.
- Look at `index.js` and `App.jsx` first to understand a change's impact crossing the backend/frontend boundary.

---

If you'd like, I can merge this into an existing `.github/copilot-instructions.md` (if present) or expand any section with concrete commands or examples. What area should I expand?
