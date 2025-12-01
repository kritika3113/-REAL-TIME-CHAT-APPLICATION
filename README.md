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

## “The server (server.js plus its package.json/package-lock.json) and the entire Vite React client (client with its manifests and source) all live on the master branch. Browse or clone that branch to access every essential file.
## All other essential project files live on the master branch in this repository. When opening the project in GitHub Desktop or the GitHub web UI, pull the master branch (treat it like you would main) to access everything.
