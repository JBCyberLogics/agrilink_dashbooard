# Admin API integration checklist

## Audit result

At implementation time, this repository supplied `VITE_API_BASE_URL` in `.env.example`, but no admin endpoint definitions, OpenAPI document, request/response schemas, auth flow, permission names, or backend integration tests. A base URL alone is not evidence that a service is available. AgriLink Control makes no API calls until contracts are agreed.

## Required contracts

| Capability | Contract needed before integration |
|---|---|
| Identity and session | Admin sign-in, current administrator, sign-out, expiry/refresh, MFA enrollment/challenge, session revocation, and unauthorized response semantics |
| Authorization | Stable server-owned permission names, role assignments, object-level rules, and consistent forbidden responses |
| Users and verification | Search/list/detail pagination, document access, state transitions, decision reasons, and immutable audit events |
| Marketplace | Listing/category/market/order/dispute schemas, supported state changes, transaction traceability, and deletion policy |
| Administration | Administrator lifecycle, role/permission read and change operations, MFA state, session invalidation |
| Notifications and operations | Alert, support, announcement, report/export, audit-log, and service-health contracts |
| NVIDIA and model registry | Backend-only secret write/mask/rotate operations, provider/model list, connection/auth test, diagnostic evidence, and config history |
| Central agent | Versioned instructions, routing, tools, permissions, test execution, result privacy, and execution history contracts |
| Algorithms | Versioned configuration, validation, isolated test execution, approval/publish workflow, and execution diagnostics |
| Market intelligence | Provider configuration, observation provenance, ingestion status, freshness, quality, geographic coverage, and history |
| AI telemetry | Aggregation permissions, prompt privacy rules, model/provider usage, latency, token/cost availability, and error contracts |

## API review requirements

Before wiring a module, agree on exact paths, HTTP methods, schemas, pagination and filter semantics, error envelope, idempotency behavior, rate limits, timeouts, CSRF/CORS policy, and permission names. Validate response bodies at the API boundary. Do not infer endpoint paths from the UI route structure.

The generic transport in `src/services/api/client.ts` supports explicit paths supplied by a future approved service and requires a response decoder at the boundary. It does not contain route mappings or capability assumptions.

## Security requirements

- Backend authentication, MFA for privileged administrators, and server-side RBAC are deployment prerequisites.
- Every sensitive request must authorize role and resource scope on the server.
- Provider secrets must remain backend-only. Return masked metadata, never a reusable secret.
- Use a reviewed session and CSRF strategy for the chosen authentication method.
- Confirmation, reason capture, and audit records are required for consequential operations.
- Restrict sensitive AI conversation access and aggregate telemetry where possible.

## Frontend operation states

Every integrated resource must distinguish loading, loaded-empty, loaded-populated, unavailable, error, forbidden, and stale data. Do not report connected, operational, applied, published, or successful without a corresponding server response. A failed or timed-out request is not an empty result.
