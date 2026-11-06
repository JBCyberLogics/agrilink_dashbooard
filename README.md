# AgriLink Control

Standalone administration frontend for the AgriLink ecosystem. The workspace contains an integration-ready UI foundation, not a connected admin backend. The login entry is implemented, but credential verification and session management remain unavailable until approved backend and identity contracts are integrated.

## Requirements

- Node.js 22.12 or newer (the current Vite toolchain also supports Node 24).
- npm 10+.

## Development

```sh
npm install
npm run dev
```

Set the backend base URL only for the approved shared backend in `.env.local`; this value alone does not connect any feature. No verified admin endpoints are connected in this repository; the auth document contains proposed paths for backend review. Provider secrets must never be added to Vite environment variables or browser storage.

The dashboard remains available for local UI review at `http://localhost:5173/__dev/dashboard-preview`. This route exists only in the Vite development build, displays an explicit preview banner, and never creates an administrator session. All regular dashboard paths return to `/login` until backend authentication is connected.

## Quality checks

```sh
npm run build
npm test
```

## Documents

- [Architecture](docs/architecture/README.md)
- [Deployment prerequisites](docs/architecture/DEPLOYMENT.md)
- [Admin API integration checklist](docs/api-integration/ADMIN_API_CONTRACT.md)
- [Proposed administrator authentication contract](docs/api-integration/ADMIN_AUTH_CONTRACT.md)
- [Administrator login implementation report](docs/implementation/ADMIN_LOGIN_IMPLEMENTATION_REPORT.md)
- [Implementation report](docs/implementation/IMPLEMENTATION_REPORT.md)
