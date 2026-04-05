# MediConnect Lanka - Quick Start Guide

## Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (for local frontend development)
- Maven 3.8+ (for local backend development)
- Java 21+ (for local backend development)

## Starting the Platform

### Option 1: Full Docker Deployment (Recommended)

```bash
cd /Users/ahsan/DSPROJECT/Health_Care_Platform

# Start all services
docker-compose up

# Wait for services to initialize (~30 seconds)
# You'll see logs from all 11 services + PostgreSQL + RabbitMQ
```

**Services will be available at:**
- **Frontend:** http://localhost:3000
- **API Gateway:** http://localhost:8080
- **Admin Service:** http://localhost:8089
- **Service Registry:** http://localhost:8761
- **Config Server:** http://localhost:8888
- **RabbitMQ Management:** http://localhost:15672 (guest/guest)

### Option 2: Local Development (Individual Services)

```bash
# Terminal 1: PostgreSQL
docker run -d \
  --name mediconnect-postgres \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=rootpassword \
  -p 5432:5432 \
  postgres:15-alpine

# Terminal 2: RabbitMQ
docker run -d \
  --name mediconnect-rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management-alpine

# Terminal 3: Config Server
cd backend/config-server
./mvnw spring-boot:run

# Terminal 4: Service Registry
cd backend/service-registry
./mvnw spring-boot:run

# Terminal 5: API Gateway
cd backend/api-gateway
./mvnw spring-boot:run

# Terminal 6-14: Individual Services
cd backend/[auth|patient|doctor|appointment|payment|notification|telemedicine|ai|admin]-service
./mvnw spring-boot:run

# Terminal 15: Frontend
cd frontend
npm install
npm run dev
```

---

## Testing the APIs

### 1. Register a New User

```bash
curl -X POST http://localhost:8080/api/auth-service/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Smith",
    "role": "DOCTOR"
  }'
```

Response:
```json
{
  "id": 1,
  "email": "doctor@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/auth-service/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@example.com",
    "password": "password123"
  }'
```

Save the returned `token` for next requests.

### 3. Get Doctor's Appointments

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/appointment-service/doctor/1/appointments
```

### 4. Get Doctor's Statistics

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/appointment-service/doctor/1/stats
```

### 5. Get Admin Dashboard Stats

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8080/api/admin-service/stats?period=7d"
```

### 6. Get Admin Activity Feed

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/admin-service/activity
```

### 7. Get System Health

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/admin-service/system-health
```

---

## Frontend Testing

### 1. Navigate to Dashboard

```
http://localhost:3000/
```

### 2. Login as Doctor

- Email: Any doctor's email (if registered)
- Navigate to: http://localhost:3000/doctor
- Should see: Live appointments and stats from backend

### 3. Login as Admin

- Email: Any admin's email (if registered)
- Navigate to: http://localhost:3000/admin
- Should see: Platform metrics and activity feed

---

## Troubleshooting

### Services Not Starting

```bash
# Check logs for specific service
docker-compose logs admin-service

# Restart specific service
docker-compose restart admin-service

# View all running services
docker-compose ps
```

### Database Issues

```bash
# Connect to PostgreSQL
docker exec -it mediconnect-postgres psql -U root

# View databases
\l

# Connect to specific database
\c appointment_db

# View tables
\dt
```

### API Gateway Not Routing

```bash
# Check service registration
curl http://localhost:8761/eureka/apps/

# Should show all registered services:
# - ADMIN-SERVICE
# - APPOINTMENT-SERVICE
# - AUTH-SERVICE
# - etc.
```

### Frontend Not Connecting

```bash
# Check if API Gateway is responding
curl http://localhost:8080/api/health

# Check browser console for CORS errors
# Check network tab for API calls
# Verify VITE_API_GATEWAY_URL environment variable
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│          http://localhost:3000                          │
│  - Patient Dashboard                                     │
│  - Doctor Dashboard ──┐                                  │
│  - Admin Dashboard ───┼──────→ Real API Calls            │
│  - AI Symptom Checker │                                  │
│  - Telemedicine      │                                  │
└──────────────────────┼──────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│         API Gateway (Spring Cloud Gateway)              │
│              http://localhost:8080                       │
│  - Route: /api/auth-service/** → Auth Service          │
│  - Route: /api/appointment-service/** → Appointment    │
│  - Route: /api/admin-service/** → Admin Service ✨ NEW  │
│  - Route: /api/doctor-service/** → Doctor Service      │
│  - (and 6 more service routes)                          │
└──────────────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────┐
│    Service Registry (Eureka) - Dynamic Discovery        │
│              http://localhost:8761                       │
│  - ADMIN-SERVICE (8089) ✨ NEW                          │
│  - APPOINTMENT-SERVICE (8084)                           │
│  - AUTH-SERVICE (8081)                                  │
│  - DOCTOR-SERVICE (8083)                                │
│  - (and 7 more services)                                │
└──────────────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────┐
│         Microservices Cluster (11 Services)             │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐    │
│  │ Auth        │  │ Admin ✨    │  │ Appointment │    │
│  │ Service     │  │ Service     │  │ Service      │    │
│  │ (8081)      │  │ (8089)      │  │ (8084)       │    │
│  └─────────────┘  └─────────────┘  └──────────────┘    │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐    │
│  │ Patient     │  │ Doctor      │  │ Payment      │    │
│  │ Service     │  │ Service     │  │ Service      │    │
│  │ (8082)      │  │ (8083)      │  │ (8085)       │    │
│  └─────────────┘  └─────────────┘  └──────────────┘    │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐    │
│  │ Notification│  │ Telemedicine│  │ AI Service   │    │
│  │ Service     │  │ Service     │  │ (8088)       │    │
│  │ (8086)      │  │ (8087)      │  │              │    │
│  └─────────────┘  └─────────────┘  └──────────────┘    │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ Config Server    │  │ Service Registry  │            │
│  │ (8888)           │  │ (8761)            │            │
│  └──────────────────┘  └──────────────────┘            │
└──────────────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────┐
│        Data & Communication Layer                        │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐                │
│  │  PostgreSQL    │  │   RabbitMQ     │                │
│  │  (5432)        │  │   (5672)       │                │
│  │ - auth_db      │  │ - notification │                │
│  │ - patient_db   │  │ - payment      │                │
│  │ - doctor_db    │  │ - appointment  │                │
│  │ - appointment_ │  │   queues       │                │
│  │   db           │  │                │                │
│  │ - payment_db   │  │                │                │
│  │ - ai_db        │  │                │                │
│  └────────────────┘  └────────────────┘                │
└──────────────────────────────────────────────────────────┘
```

---

## Key Features

### Doctor Dashboard
- ✅ Real appointments from backend
- ✅ Live statistics (pending, completed, today)
- ✅ Accept/Decline/Complete appointments
- ✅ Search and filter functionality
- ✅ Video consultation buttons
- ✅ Fallback demo data if API unavailable

### Admin Dashboard
- ✅ Real platform metrics
- ✅ Recent activity feed
- ✅ System health monitoring
- ✅ Period-based filtering (24h, 7d, 30d)
- ✅ Key performance indicators
- ✅ Fallback demo data if API unavailable

### Admin Service API (NEW)
- ✅ `/api/admin/stats` - Aggregate metrics
- ✅ `/api/admin/activity` - Recent events
- ✅ `/api/admin/system-health` - System status

---

## Performance Tips

1. **Local Development:** Use Option 2 (individual terminals) for faster iteration
2. **Docker:** First run is slow (~2 minutes) due to image builds, subsequent runs are faster
3. **Database:** PostgreSQL takes ~5 seconds to initialize, services wait for it
4. **Frontend:** Vite HMR is enabled for instant refresh on file changes
5. **Caching:** Admin service returns cached data by default (upgradeable with Redis)

---

## Support & Documentation

- **Implementation Status:** See `IMPLEMENTATION_COMPLETED.md`
- **API Reference:** See `REPORT_CHUNKS.md`
- **Analysis Report:** See `WEBSITE_ANALYSIS_REPORT.md`
- **Detailed Plan:** See `implementation_plan.md`

---

## Success Indicators

✅ All services healthy in Eureka registry
✅ Doctor dashboard loads appointments in <1 second
✅ Admin dashboard shows all metrics
✅ API calls show in browser network tab
✅ No CORS errors in console
✅ Fallback demo data shows if API unavailable
✅ Status updates persist to backend

**You're ready to go! 🚀**


