# MediConnect Lanka - AI-Enabled Smart Healthcare Platform

A complete, cloud-native microservices architecture for a Healthcare Appointment & Telemedicine Platform.

## Prerequisites
- Java 21 & Maven OR Docker & Docker Compose
- Node.js 20+ & npm

## Running Locally for Development

### 1. Start Infrastructure
Start the supporting services (PostgreSQL, RabbitMQ):
```bash
docker-compose up -d
```
*Note: This will initialize all the required databases automatically using `infrastructure/db-init/init.sql`.*

### 2. Start Backend Microservices
Run the services in this exact order to ensure Eureka and Config Server are up before domain services boot:

1. **config-server** (Port 8888)
2. **service-registry** (Port 8761)
3. **api-gateway** (Port 8080)
4. Domain Services: `auth-service`, `patient-service`, `doctor-service`, `appointment-service`, `telemedicine-service`, `payment-service`, `notification-service`, `ai-service`.

To run any service locally:
```bash
cd backend/<service-name>
./mvnw spring-boot:run
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## Kubernetes Deployment (Minikube)
1. Start minikube: `minikube start`
2. Apply infrastructure configs:
   ```bash
   kubectl apply -f k8s/infrastructure/config-secret.yaml
   kubectl apply -f k8s/infrastructure/postgres-deployment.yaml
   kubectl apply -f k8s/infrastructure/rabbitmq-deployment.yaml
   ```
3. Apply service deployments (after building their respective docker images and loading them into Minikube).

## API Gateway Endpoints
All API requests go through the API Gateway at `http://localhost:8080/`.

- `POST /auth-service/auth/login`
- `POST /auth-service/auth/register`
- `GET /patient-service/patients/{id}`
- `GET /doctor-service/doctors`
- `POST /appointment-service/appointments`
- `GET /telemedicine-service/telemedicine/generate-room`
- `POST /ai-service/ai/symptom-checker`
