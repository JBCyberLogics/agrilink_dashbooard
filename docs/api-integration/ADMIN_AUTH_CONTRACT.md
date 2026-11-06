# Administrator authentication contract

## Current status

**NOT_CONFIGURED.** This frontend has no verified administrator authentication endpoint or session protocol. The login page performs local required-field checks, but `authService.login`, `restoreSession`, and `logout` make no network requests and cannot create an authenticated state. The development dashboard preview is a separate Vite-development-only route and never sets an auth session.

The paths and payloads below are a proposal for backend review. They are not implemented or verified endpoints.

## Proposed session API

All paths are under the approved admin API origin; do not infer the origin from the browser route. Requests should use HTTPS and `credentials: 'include'`.

| Method | Proposed path | Purpose |
|---|---|---|
| `POST` | `/api/admin/auth/login` | Validate the supplied username and password and establish the administrator session. |
| `GET` | `/api/admin/auth/session` | Restore the current session after refresh and return current identity and permissions. |
| `POST` | `/api/admin/auth/logout` | Revoke the current session server-side and expire its cookie. |

### Login request

```json
{
  "username": "<entered username>",
  "password": "<entered password>"
}
```

The browser sends the password only in the TLS-protected request body. Neither credentials nor session secrets may be logged, placed in URLs, or persisted in browser storage.

### Successful response

The backend should set the session cookie using `Secure`, `HttpOnly`, and an agreed `SameSite` policy, with a narrow `Path`, explicit expiry, and CSRF protection appropriate to the deployment. The response body should contain identity and authorization metadata only, never a reusable bearer/session token:

```json
{
  "administrator": {
    "id": "<stable id>",
    "displayName": "<display name>",
    "roles": ["<server-defined role>"],
    "permissions": ["<server-defined permission>"],
    "mfaEnrolled": true
  },
  "expiresAt": "<ISO-8601 timestamp>"
}
```

This shape aligns with the frontend's existing `CurrentAdministrator` type. The backend team must confirm field names, permission semantics, MFA challenge flow, cookie scope, CSRF mechanism, and the error envelope before the adapter is connected.

### Errors and policy

- Invalid credentials should return a generic failure that does not disclose whether a username exists.
- Expired or revoked sessions should return the agreed unauthenticated response; the frontend then returns to `/login`.
- MFA requirements must be agreed before launch. The current requested form contains username and password only, so any challenge/step-up experience requires a separate approved UI contract.
- Define stable permission identifiers and per-module authorization rules with the backend team. The client may use confirmed permissions to adjust navigation, but every API request and sensitive operation must enforce authorization server-side.
- Agree on rate limits, audit events, CORS, CSRF, session renewal/expiry, and revocation behavior.

## Frontend boundary

`src/modules/auth/services/authService.ts` is intentionally inert while status is `NOT_CONFIGURED`. The `AuthProvider` can hold only a session returned by the service. `ProtectedRoute` gates the existing dashboard; Vite's development-only preview route is the only dashboard exception and is removed from production builds.

Do not enable auth from a browser flag, local storage value, user-editable query string, or a `VITE_*` secret. An approved API base URL alone does not constitute an authentication integration.
