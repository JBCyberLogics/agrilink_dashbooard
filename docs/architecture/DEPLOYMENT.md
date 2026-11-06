# Deployment prerequisites

This frontend is not ready to serve privileged production data. Complete the following before deployment beyond an isolated UI preview:

1. Integrate the approved admin identity provider, MFA policy, session lifecycle, CSRF strategy, and backend RBAC.
2. Connect only documented admin API paths and validate response schemas. The base URL variable does not establish a connection by itself.
3. Set `VITE_API_BASE_URL` to the approved shared backend origin. Keep provider keys and all other secrets on the backend.
4. Serve the frontend and API over HTTPS. Configure backend CORS and cookie policy for the explicit AgriLink Control origin.
5. Configure static hosting to return `index.html` for application routes such as `/ai/control-centre` and `/settings/security`.
6. Apply a content security policy and avoid logging private user records or AI prompt content in the browser.
7. Run the production build, unit tests, authenticated integration tests, browser QA, accessibility review, and deployment smoke checks against the actual environment.

Do not treat the UI's status labels or route visibility as authorization. Every privileged operation must be authorized by the backend.
