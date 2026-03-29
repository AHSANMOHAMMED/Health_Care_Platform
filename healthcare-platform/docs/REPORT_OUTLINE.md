# report.pdf — suggested structure (export this document to PDF after editing)

## 1. High-level architecture

Describe clients → **HTTPS** → **Spring Cloud Gateway** (JWT validation) → **Eureka-discovered** microservices → **PostgreSQL per service**, **RabbitMQ** for async notifications/events. Include a diagram (draw.io / Excalidraw) matching the deployment view.

## 2. Service interfaces (REST, not UI)

List base path (via gateway `http://HOST:8080`) and main endpoints per service:

| Service | Examples |
|---------|----------|
| user-service | `POST /api/auth/register`, `POST /api/auth/login`, `GET/POST/PUT /api/patients/me`, `POST /api/reports` (multipart), `GET /api/reports/my`, `GET /api/users` (admin), `GET /internal/v1/patients/{id}` |
| doctor-service | `POST /api/doctors/me`, `POST /api/doctors/me/availability`, `GET /api/doctors/search`, `GET /internal/v1/doctors/{id}/covers` |
| appointment-service | `POST /api/appointments`, `GET /api/appointments/me`, `PATCH .../doctor-status`, `POST .../prescription`, `GET /api/prescriptions/me` |
| telemedicine-service | `POST /api/telemedicine/sessions` |
| payment-service | `POST /api/payments/payhere/checkout-params`, `POST /api/payments/payhere/notify` |
| notification-service | `POST /api/notifications/sms` |
| ai-service | `POST /api/ai/symptom-check` |

## 3. Workflows

Use sequence diagrams for:

1. **Registration & login** (JWT issuance, roles PATIENT/DOCTOR/ADMIN).  
2. **Doctor verification** (admin PATCH) → availability → patient search.  
3. **Booking** → doctor confirm → **telemedicine** token → video consult → prescription.  
4. **PayHere**: checkout param generation (MD5 per PayHere spec) → notify URL verification.  

## 4. Security

- **JWT**: HS256 shared secret; gateway validates and forwards `X-User-Id` / `X-User-Role` optional pattern; services re-validate Bearer tokens.  
- **RBAC**: Spring Security `@PreAuthorize` / `hasRole` on controllers.  
- **Internal APIs**: `/internal/**` intended for cluster network only (document threat model).  

## 5. Individual contributions

One subsection per group member (max 3 minutes spoken demo each).

## 6. Appendix — code as text

Paste full source for non-generated code **as plain text** (no screenshots). Exclude `target/`, `node_modules/`, `.idea/`.

---

**Turnitin**: paraphrase explanations; cite tutorials and vendor docs; keep similarity below policy.
