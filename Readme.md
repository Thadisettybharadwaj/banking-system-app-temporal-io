# Banking System Application 🚀

---

## 🧱 Overview

- **Backend** – an Express server located under `server/` exposing a health check route.
- **Frontend** – a Vite‑powered React application under `frontend/` with simple navigation and a page that checks the server health.
- **Monorepo style** – a single `package.json` at the root that manages dependencies and scripts for both sides.
- **Quality tooling** – linting, formatting, commit message enforcement, and changelog management are pre‑configured.

---

## 📁 Repository Structure

```
full-stack-starter/
├── frontend/            # React application (Vite)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── constants/URLs.ts
│   │   ├── interfaces/Interfaces.ts
│   │   ├── pages/
│   │   │   ├── Health.tsx
│   │   │   └── Welcome.tsx
│   │   ├── router/Router.tsx
│   │   └── main.tsx
│   └── vite.config.ts
├── server/              # Express backend
│   ├── api/health.ts
│   └── index.ts
├── eslint.config.js     # Shared ESLint configuration
├── package.json         # Scripts & dependencies for both front/backend
├── commitlint.config.mjs
├── .changeset/          # Changesets configuration
└── Readme.md            # This file
```

---

## 🛠️ Prerequisites

- Node.js v18+ (LTS recommended)
- npm (comes with Node.js)

---

## 🚀 Getting Started

1. **Clone the repository**

   ```sh
   git clone <repo-url> full-stack-starter
   cd full-stack-starter
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Run in development mode**
   - Start both backend and frontend concurrently:

     ```sh
     npm run dev
     ```

   - or run separately:
     ```sh
     npm run dev:server    # Express server on http://localhost:3001
     npm run dev:frontend  # Vite dev server on http://localhost:5173
     ```

4. **Open the app**
   Visit `http://localhost:5173` and use the navigation to check server health.

---


