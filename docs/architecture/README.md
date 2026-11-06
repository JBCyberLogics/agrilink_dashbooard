# AgriLink Control architecture

## Current application boundary

AgriLink Control is a standalone React + TypeScript administration frontend in this repository. It has its own entry point, routes, design tokens, navigation, and feature surfaces. It does not add admin routes to the farmer/buyer application.

```text
AgriLink Platform (farmer / buyer) ─┐
                                    ├─ Shared AgriLink backend and authorized APIs
AgriLink Control (admin frontend) ──┘
```

The repository contained no application source, backend schema, admin endpoint list, identity integration, or permission contract during the initial audit. The current interface therefore displays unavailable and not-tested states. It does not request live records, create an admin session, or simulate successful operations.

## Source structure

- `src/config/navigation.ts`: route catalogue, navigation groups, target AI capabilities, proposed roles.
- `src/modules/dashboard/`: dashboard and analytics views.
- `src/modules/admin/`: resource, role, AI operations, provider, capability, health, and settings views.
- `src/modules/ai/`: local deterministic algorithm workspace.
- `src/components/`: shared route title, status, feedback, readiness, and backend-blocker components.
- `src/contracts/`: integration shapes for discussion; not a substitute for agreed server schemas or authorization.
- `src/services/api/client.ts`: generic transport with JSON handling, abort support, timeout, credentials mode, and structured errors. No endpoint paths are defined or called.
- `src/lib/algorithms.ts`: deterministic user-input calculators; no application records are read or changed.
- `src/App.tsx`: login entry, authenticated route gate, development-only dashboard preview, shell, navigation, route history, search, theme, and route composition.
- `src/modules/auth/`: sign-in UI, backend integration seam, auth context, protected route, and development-preview route helpers.
- `src/theme.css` and `src/styles.css`: centralized semantic light/dark tokens and responsive components.
- `docs/api-integration/`: backend dependencies and contract checklist.
- `docs/architecture/DEPLOYMENT.md`: deployment prerequisites and production security gates.
- `docs/implementation/IMPLEMENTATION_REPORT.md`: delivery status and verification evidence.

## Route model

The application uses browser history and a route catalogue in `src/config/navigation.ts`. `/login` is the unauthenticated entry. Existing dashboard routes are gated by `AuthProvider` and `ProtectedRoute`; until the backend contract is configured they do not grant access. In Vite development only, `/_dev/dashboard-preview` (and nested dashboard routes) exposes the unchanged UI with a visible no-session banner. Vite removes that exception from production builds. Before deployment with real admin data, integrate the shared identity provider, session lifecycle, MFA policy, and backend RBAC. Every server request must independently authorize the current administrator.

## Data and security boundaries

- No production, seeded, random, or illustrative records are bundled.
- No chart is rendered without valid telemetry.
- The UI does not send provider keys or private data to a provider directly.
- No browser storage is used for credentials. Only the non-sensitive theme preference is stored locally.
- The generic API client is inert until an approved call site and exact backend contract exist.
- Proposed role and permission names document intended scope only. The backend is the security authority.
- The local calculators operate on values entered by the current user and never persist or transmit them.

## Frontend state ownership

Theme, navigation, and search state are local presentation state. Operational data, authorization, provider state, audit events, settings, and mutations must come from authenticated backend services. Do not introduce local persistence for administrative records or secret values.
