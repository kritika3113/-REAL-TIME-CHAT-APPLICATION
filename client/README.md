# Real-Time Chat Client

This Vite + React frontend connects to the accompanying Node/Express + Socket.IO server to provide a real-time chat experience with login, alternating message bubbles, and a conversation history view.

## Repository Layout

- `server.js`: Express + Socket.IO backend entry point (runs on port 4000).
- `package.json` / `package-lock.json`: Backend dependencies.
- `client/`: Vite + React frontend source.
	- `client/src/`: React components (`chat.jsx`, etc.).
	- `client/public/`: Static assets served by Vite.
	- `client/vite.config.js`: Vite configuration.
	- `client/package.json` / `client/package-lock.json`: Frontend dependencies.
	- `client/.gitignore` and `client/eslint.config.js`: Tooling metadata.

Exclude both `node_modules/` folders when committing; they are regenerated via `npm install`.

## Prerequisites

- Node.js 18+ and npm installed locally
- The backend in the repository root (`server.js`) running on port 4000

## Install Dependencies

From the repository root run:

```powershell
npm install
```

Then install the client dependencies:

```powershell
Push-Location client
npm install
Pop-Location
```

## Start the Servers

In one terminal launch the backend from the project root:

```powershell
node server.js
```

In a second terminal start the Vite dev server from the `client` directory:

```powershell
Push-Location client
npm run dev
Pop-Location
```

Vite will report a local URL (usually `http://localhost:5173`). Open it in a browser, enter a display name, and begin chatting.

## Building for Production

To create an optimized client build:

```powershell
Push-Location client
npm run build
Pop-Location
```

Serve the generated `client/dist` directory with any static file host and point the backend's static file middleware (or a reverse proxy) to it as needed.
