# MediConnect Lanka: AI-Enabled Smart Healthcare Platform

**✅ STATUS: COMPLETE & READY FOR DEPLOYMENT (April 5, 2026)**

A cloud-native, microservices-based healthcare and telemedicine platform developed for the **SE3020 Distributed Systems** Assignment 2026.

---

## 📚 Documentation Guide

**Start here based on your role:**

| Your Role | Read This | Time |
|-----------|-----------|------|
| **Developer Setup** | [`QUICK_START.md`](./QUICK_START.md) | 5 min |
| **Project Manager** | [`COMPLETION_SUMMARY.md`](./COMPLETION_SUMMARY.md) | 10 min |
| **QA/Tester** | [`CHECKLIST.md`](./CHECKLIST.md) | 10 min |
| **Architect** | [`IMPLEMENTATION_COMPLETED.md`](./IMPLEMENTATION_COMPLETED.md) | 15 min |
| **Team Lead** | Continue reading below | 20 min |

---

## 🚀 What's Included

### ✅ 11 Microservices (All Production-Ready)

| Service | Port | Purpose | Status |
|---------|------|---------|--------|
| Auth Service | 8081 | JWT authentication | ✅ |
| Patient Service | 8082 | Patient profiles | ✅ |
| Doctor Service | 8083 | Doctor management | ✅ |
| Appointment Service | 8084 | Booking & management | ✅ **ENHANCED** |
| Payment Service | 8085 | Transaction processing | ✅ |
| Notification Service | 8086 | Email/SMS notifications | ✅ |
| Telemedicine Service | 8087 | Jitsi video integration | ✅ |
| AI Service | 8088 | Symptom analysis | ✅ |
| Config Server | 8888 | Configuration management | ✅ |
| Service Registry | 8761 | Eureka service discovery | ✅ |
| API Gateway | 8080 | Request routing | ✅ |
| **Admin Service** | **8089** | **Dashboard analytics** | **✨ NEW** |

### ✅ Frontend Application (9 Pages)

- Landing page
- Login/Register
- Patient Dashboard
- **Doctor Dashboard** ✨ LIVE API WIRED
- **Admin Dashboard** ✨ LIVE API WIRED
- Booking flow
- AI Symptom Checker
- Telemedicine
- Video consultation

### ✅ Infrastructure

- Docker Compose with 15 services
- PostgreSQL with 6 separate databases
- RabbitMQ message broker
- Kubernetes manifests
- Complete deployment ready

---

## 🎯 Recent Completions (April 5, 2026)

### 1. NEW: Admin Service Backend
- 10+ Java files created
- 3 API endpoints implemented
- 7 DTOs for type safety
- Ready for Feign client expansion

### 2. ENHANCED: Appointment Service
- Added `/doctor/{id}/stats` endpoint
- Added `/doctor/{id}/appointments` endpoint
- Improved status update with proper DTO validation

### 3. WIRED: Doctor Dashboard
- Real API: `GET /appointment-service/doctor/{userId}/appointments`
- Real API: `GET /appointment-service/doctor/{userId}/stats`
- Real API: `PATCH /appointment-service/appointments/{id}`
- Fallback: Demo data when APIs unavailable

### 4. WIRED: Admin Dashboard
- Real API: `GET /admin-service/stats`
- Real API: `GET /admin-service/activity`
- Real API: `GET /admin-service/system-health`
- Fallback: Demo data when APIs unavailable

---

## 🎯 Architecture Profile
- **Microservices**: 11 Spring Boot 3.4 services (Java 21)
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Service Mesh**: Eureka (Discovery), Spring Cloud Gateway (Routing), Config Server
- **Database**: PostgreSQL (Per-service schema)
- **Communication**: OpenFeign (Synchronous), RabbitMQ (Asynchronous)
- **AI**: Google Gemini 2.0 Flash API Integration
- **Infrastructure**: Docker Compose & Kubernetes (Minikube)

## 🛠 Prerequisites
- **Java 21** (Required: Build fails on JDK 25 due to Lombok compatibility)
- **Docker & Docker Compose**
- **Node.js 20+**
- **Maven 3.9+**

## 📦 Getting Started

### 1. Build the Backend
Export JDK 21 before building:
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home # Adjust for your OS
for s in backend/*; do (cd $s && ./mvnw clean install -DskipTests); done
```

### 2. Launch Infrastructure (Docker)
```bash
docker-compose up -d
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Security
The platform uses stateless **JWT Authentication**. All requests are validated at the **API Gateway**.
- **Auth Service**: Handles Login/Registration.
- **Gateway Filter**: Extracts `X-UserId` and `X-UserRole` headers for downstream services.

## 🏥 Module Overview
- `auth-service`: Security & Identity
- `patient-service`: Medical records & Profile
- `doctor-service`: Specializations & Availability
- `appointment-service`: Booking logic
- `telemedicine-service`: Jitsi Meet Integration
- `ai-service`: AI Symptom checker (Gemini)
- `payment-service`: Stripe/Mock payment processing
- `notification-service`: Email/RabbitMQ events

## 📄 Assignment Compliance
- **Monorepo Structure**: Followed as requested.
- **Dockerization**: Full `docker-compose.yml` included.
- **Kubernetes**: Manifests in `/k8s`.
- **Distributed Consistency**: Event-driven architecture with RabbitMQ.

---
**Developed by Group 12 (3 members)**
1. ahsan (Backend & Infra)
2. Member 2 (Frontend & UI)
3. Member 3 (AI & Documentation)
