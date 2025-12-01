“Initial real-time chat app setup”
## Repository Layout

- `server.js`: Express + Socket.IO backend entry point (runs on port 4000).
- `package.json` / `package-lock.json`: Backend dependencies.
- `client/`: Vite + React frontend source.
	- `client/src/`: React components (`chat.jsx`, etc.).
	- `client/public/`: Static assets served by Vite.
	- `client/vite.config.js`: Vite configuration.
	- `client/package.json` / `client/package-lock.json`: Frontend dependencies.
	- `client/.gitignore` and `client/eslint.config.js`: Tooling metadata.
