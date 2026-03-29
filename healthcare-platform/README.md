# Healthcare Platform (SE3020) — Spring Cloud Microservices

Java **21**, **Spring Boot 3.3.5**, **Spring Cloud 2023.0.3** (Netflix **Eureka** + **Spring Cloud Gateway**), dedicated **PostgreSQL 16** databases (Docker), **RabbitMQ**, React **18** + **Vite** + **TypeScript** + **Tailwind** frontend.

## Prerequisites

- JDK 21 + **Maven 3.9+**
- Docker Desktop (for Compose) or kubectl + Minikube (for Kubernetes samples)

## Quick start (Docker Compose)

From this directory (`healthcare-platform/`):

```bash
cp .env.example .env   # optional: fill Agora, PayHere, Twilio, OpenAI
mvn -DskipTests package
docker compose up --build
```

- **Eureka**: http://localhost:8761  
- **API Gateway**: http://localhost:8080  
- **Frontend dev** (separate terminal):

```bash
cd frontend && npm install && npm run dev
```

Frontend proxies `/api` to the gateway (see `frontend/vite.config.ts`). Default admin account is seeded in `user-service`: `admin@healthcare.local` / `Admin#12345`.

## Local development without Docker (partial)

1. Start PostgreSQL instances on ports **5433–5437** matching `application.yml` defaults (or override env vars).  
2. Start **RabbitMQ** on `localhost:5672`.  
3. Start **discovery-service**, then **user-service**, remaining services, then **api-gateway**.

## External integrations (sandbox)

| Integration | Env vars | Notes |
|-------------|-----------|--------|
| **Agora** | `AGORA_APP_ID`, `AGORA_APP_CERTIFICATE` | Without certificate, telemedicine service issues **mock** tokens for demos. |
| **PayHere** | `PAYHERE_MERCHANT_ID`, `PAYHERE_MERCHANT_SECRET`, `PAYHERE_SANDBOX` | Verify hash algorithm with [official PayHere docs](https://www.payhere.lk/) before production; `/api/payments/payhere/checkout-params` builds signed fields. |
| **Twilio** | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_PHONE` | SMS logs as **noop** if unset. |
| **OpenAI** | `OPENAI_API_KEY` | AI symptom checker falls back to rule-based heuristics if unset. |

JWT: set a long `JWT_SECRET` (same value for **api-gateway** and all stateful services) in `.env` or Compose.

## Kubernetes (Minikube)

```bash
minikube start
kubectl apply -f k8s/
```

Samples use `imagePullPolicy: Never` + `minikube image load` workflow — see comments in `k8s/README.md`. Production would use a container registry and external managed Postgres.

## Module layout

- `services/discovery-service` — Eureka server  
- `services/api-gateway` — routes + JWT filter  
- `services/user-service` — auth, patient profile, reports, internal APIs for Feign  
- `services/doctor-service` — doctor profiles, availability, Feign → user reports  
- `services/appointment-service` — booking, Feign → user/doctor/telemedicine, Rabbit events  
- `services/telemedicine-service` — session metadata + token generation (Agora-ready)  
- `services/payment-service` — PayHere-oriented checkout params + notify stub  
- `services/notification-service` — Twilio SMS (optional)  
- `services/ai-service` — OpenAI / heuristic symptom checker  
- `frontend` — React SPA with Axios interceptor + Agora sample widget  

## Assignment deliverables

- `submission.txt` — GitHub + YouTube links (fill in).  
- `members.txt` — group roster (fill in).  
- `readme.txt` — short deployment checklist.  
- `docs/REPORT_OUTLINE.md` — paste/export into `report.pdf`.  

## Building all modules

```bash
mvn clean package -DskipTests
```

Each service JAR is under `services/<name>/target/`.
