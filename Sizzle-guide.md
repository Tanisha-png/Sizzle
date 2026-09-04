## Project Overview
This repository appears to be a full-stack TypeScript project with a React + Vite frontend and a Node-based backend, based on the presence of a frontend package using React/Vite and a backend package with Express/Mongoose dependencies and TypeScript tooling in the root package.json and tsconfig.json files [frontend/package.json][frontend/vite.config.ts][package.json][tsconfig.json].  
The frontend lives in the frontend/ directory, depends on react and react-dom, and uses Vite with the official React plugin as shown in vite.config.ts [frontend/package.json][frontend/vite.config.ts].  
The backend is defined at the repository root (its package.json is named "backend") and lists express, mongoose, cors, and dotenv among its dependencies, indicating an Express/Mongoose API server that loads environment variables [package.json].  
Backend scripts reference server.ts for development and dist/server.js for production, making server.ts the likely backend entry point during development and dist/server.js the production entry point after a build step [package.json].  
There is also a backend/ subdirectory with its own package.json; its dev script runs server.ts via nodemon and tsx, and it lists libraries such as bcryptjs, cors, dotenv, jsonwebtoken, and mongoose, suggesting overlapping or alternative backend setup paths in the repository [backend/package.json].  
TypeScript is used across both backend and frontend, as shown by the root tsconfig.json and the frontend tsconfig files [tsconfig.json][frontend/tsconfig.app.json].  
ESLint is configured for TypeScript in the root and for React/TypeScript in the frontend, indicating linting is part of the developer workflow [eslint.config.ts][frontend/eslint.config.js].

## Setup / Installation
The evidence does not show which package manager this project uses or any engine constraints, and no lockfiles are included in the provided evidence [package.json][frontend/package.json].  
You will need to install dependencies separately wherever a package.json exists, at minimum in the repository root (backend) and in frontend/ since both contain package manifests [package.json][frontend/package.json].  
There is also a backend/ directory that contains its own package.json, which may also require its own dependency installation if that path is used locally [backend/package.json].  
Environment variables are expected in the backend (dotenv is a dependency), and .env files are git-ignored with .env.example explicitly allowed, though no .env.example file is shown in the provided evidence [package.json][.gitignore].  
ESLint is set up at the root via eslint.config.ts with rules for TypeScript, and the root package.json defines eslint and eslint:fix scripts for linting [eslint.config.ts][package.json].  
The frontend defines its own ESLint configuration and a lint script, which you can run within the frontend/ directory [frontend/eslint.config.js][frontend/package.json].

## Running Locally
Backend (root): a dev script runs server.ts using Node with the ts-node ESM loader and file watching: node --loader ts-node/esm --no-warnings --watch server.ts [package.json].  
Backend (root) production: the start script runs node dist/server.js, implying you’ll need compiled output in dist before using start, though no backend build script is shown in the provided evidence [package.json].  
Alternative backend path: the backend/ directory defines a dev script nodemon --exec tsx server.ts, which can be used if you develop from that subpackage [backend/package.json].  
Frontend: the dev script runs Vite, build runs tsc -b && vite build, and preview runs vite preview, all within the frontend/ directory [frontend/package.json].  
During frontend development, any request to paths starting with /api is proxied to http://localhost:3000 by Vite’s dev server, so the backend should be reachable at that address for API calls to work in the browser during dev [frontend/vite.config.ts].  
The backend TypeScript configuration outputs to dist per tsconfig.json, and the start script expects dist/server.js accordingly, but the evidence does not include a root-level build script to produce that artifact [tsconfig.json][package.json].

## Project Structure
Root (backend): package.json (named "backend"), tsconfig.json, and eslint.config.ts define the backend package, TypeScript compiler options, and lint rules [package.json][tsconfig.json][eslint.config.ts].  
Frontend: the frontend/ directory contains its own package.json, Vite configuration, ESLint configuration, and TypeScript configs (tsconfig.app.json, tsconfig.node.json, and a project tsconfig.json with references), indicating a standalone React/Vite TypeScript app [frontend/package.json][frontend/vite.config.ts][frontend/eslint.config.js][frontend/tsconfig.app.json][frontend/tsconfig.node.json][frontend/tsconfig.json].  
Backend entry points: scripts reference server.ts for development and dist/server.js for production, though the actual server.ts file is not included in the provided evidence [package.json].  
Additional backend folder: a backend/ subdirectory also contains a package.json with its own dev script and dependencies, which may represent an alternative or legacy backend package [backend/package.json].  
Ignore files: .gitignore at the root and a separate frontend/.gitignore manage ignored files, including environment files and build artifacts [.gitignore][frontend/.gitignore].

## Testing
The root test script is a placeholder that echoes an error and exits, and no testing framework dependencies are shown in the provided evidence [package.json].  
The frontend/package.json does not define any test script in the provided evidence [frontend/package.json].  
No test files, setup files, or testing patterns are visible in the provided evidence [package.json][frontend/package.json].

## Uncertainties and Missing Information

The following evidence was found but excluded due to per-section token budgets, and may be missing from this guide:

- `README.md (Sizzle 🔥 👩🏽‍🍳)` — excluded from evidence selection (irrelevant or over budget)
- `README.md (👁️ The Vision)` — excluded from evidence selection (irrelevant or over budget)
- `README.md (🔩 Tech Stack)` — excluded from evidence selection (irrelevant or over budget)
- `README.md (🔑 Key Features (MVP))` — excluded from evidence selection (irrelevant or over budget)
- `backend/middleware/authMiddleware.ts (AuthRequest)` — excluded from evidence selection (irrelevant or over budget)
- `backend/middleware/authMiddleware.ts (authenticate)` — excluded from evidence selection (irrelevant or over budget)
- `backend/models/Recipe.ts (IRecipe)` — excluded from evidence selection (irrelevant or over budget)
- `backend/models/User.ts (IUser)` — excluded from evidence selection (irrelevant or over budget)
- `backend/package-lock.json` — excluded from evidence selection (irrelevant or over budget)
- `backend/package-lock.json` — excluded from evidence selection (irrelevant or over budget)
- `backend/package-lock.json` — excluded from evidence selection (irrelevant or over budget)
- `backend/package-lock.json` — excluded from evidence selection (irrelevant or over budget)
- `backend/package-lock.json` — excluded from evidence selection (irrelevant or over budget)
- `backend/package-lock.json` — excluded from evidence selection (irrelevant or over budget)
- `backend/package-lock.json` — excluded from evidence selection (irrelevant or over budget)
- `backend/package-lock.json` — excluded from evidence selection (irrelevant or over budget)
- `backend/package-lock.json` — excluded from evidence selection (irrelevant or over budget)
- `frontend/README.md (React + TypeScript + Vite)` — excluded from evidence selection (irrelevant or over budget)
- `frontend/README.md (React Compiler)` — excluded from evidence selection (irrelevant or over budget)
- `frontend/README.md (Expanding the ESLint configuration)` — excluded from evidence selection (irrelevant or over budget)
- …and 135 more excluded chunk(s)