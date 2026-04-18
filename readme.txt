================================================================================
MEDICONNECT - DEPLOYMENT GUIDE
================================================================================

SYSTEM REQUIREMENTS
-------------------
- Docker Desktop 4.0+ (with Kubernetes enabled)
- 8GB+ RAM allocated to Docker
- 50GB free disk space
- macOS / Linux / Windows with WSL2


OPTION 1: DOCKER COMPOSE DEPLOYMENT (Recommended for Local)
===========================================================

Step 1: Clone Repository
--------------------------
git clone https://github.com/ahsan/DSPROJECT/Health_Care_Platform.git
cd Health_Care_Platform


Step 2: Environment Configuration
---------------------------------
cp .env.example .env

# Edit .env with your credentials:
# - Database passwords
# - JWT secret key
# - Stripe API keys (for payments)
# - SendGrid API key (for emails)
# - Twilio credentials (for SMS)
# - Google Gemini API key (for AI)


Step 3: Start Infrastructure Services
-------------------------------------
# Start PostgreSQL and RabbitMQ first
docker-compose up -d postgres rabbitmq

# Wait 30 seconds for databases to initialize
sleep 30


Step 4: Build & Start All Services
----------------------------------
# Build all microservices (this may take 15-20 minutes)
docker-compose up -d

# Or build specific services:
docker-compose up -d service-registry config-server
sleep 10
docker-compose up -d api-gateway auth-service
sleep 10
docker-compose up -d patient-service doctor-service
sleep 10
docker-compose up -d appointment-service payment-service prescription-service
docker-compose up -d telemedicine-service notification-service ai-service admin-service
docker-compose up -d frontend


Step 5: Verify Deployment
--------------------------
# Check running containers
docker ps

# Expected: 16 containers running
# - postgres, rabbitmq
# - 13 backend microservices
# - frontend

# View logs
docker-compose logs -f [service-name]


Step 6: Access Application
---------------------------
Frontend:       http://localhost:3000
API Gateway:    http://localhost:8080
Eureka Registry: http://localhost:8761
RabbitMQ Mgmt:  http://localhost:15673 (guest/guest)

Database Connection:
Host: localhost
Port: 5432
User: root
Password: rootpassword
Databases: mediconnect_*_db


OPTION 2: KUBERNETES DEPLOYMENT (Production)
============================================

Prerequisites:
- Kubernetes cluster (minikube, EKS, GKE, or AKS)
- kubectl configured
- Helm 3.x installed

Step 1: Start Minikube (Local K8s)
----------------------------------
minikube start --driver=docker --memory=8192 --cpus=4


Step 2: Deploy Infrastructure
-----------------------------
kubectl apply -f k8s/infrastructure/

# Wait for PostgreSQL and RabbitMQ to be ready
kubectl wait --for=condition=ready pod -l app=postgres --timeout=300s
kubectl wait --for=condition=ready pod -l app=rabbitmq --timeout=300s


Step 3: Deploy Microservices
-----------------------------
kubectl apply -f k8s/services/


Step 4: Verify K8s Deployment
-----------------------------
kubectl get pods -n mediconnect
kubectl get svc -n mediconnect
kubectl get ingress -n mediconnect


Step 5: Access Services (Minikube)
----------------------------------
minikube service list -n mediconnect
minikube tunnel  # For LoadBalancer services


TROUBLESHOOTING
---------------

Issue: Port already in use
Solution: docker-compose down && docker rm -f $(docker ps -aq)

Issue: Maven build fails (SSL error)
Solution: We've added settings.xml with Aliyun mirror. Retry:
docker builder prune -f && docker-compose up -d

Issue: Service not starting
Solution: Check logs: docker-compose logs [service-name]

Issue: Database connection failed
Solution: Ensure postgres is healthy first:
docker-compose up -d postgres && sleep 30 && docker-compose up -d

Issue: Out of memory
Solution: Increase Docker Desktop memory to 8GB+


USEFUL COMMANDS
---------------
# Stop all services
docker-compose down

# Rebuild specific service
docker-compose build --no-cache [service-name]

# View service logs
docker-compose logs -f [service-name]

# Scale a service
docker-compose up -d --scale [service-name]=3

# Clean everything
docker-compose down -v
docker system prune -a


PRODUCTION DEPLOYMENT CHECKLIST
-------------------------------
□ Change default passwords in .env
□ Set up SSL/TLS certificates
□ Configure proper JWT secrets
□ Enable firewall rules
□ Set up monitoring (Prometheus/Grafana)
□ Configure log aggregation
□ Database backup strategy
□ CI/CD pipeline setup

================================================================================
