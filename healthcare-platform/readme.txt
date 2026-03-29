DEPLOYMENT STEPS (summary)
1) Install JDK 21 and Maven 3.9+.
2) Copy .env.example to .env and set JWT_SECRET and optional third-party keys.
3) From folder healthcare-platform run: mvn clean package -DskipTests
4) Run: docker compose up --build
5) Wait for Eureka at http://localhost:8761 ; API via http://localhost:8080
6) Frontend: cd frontend && npm install && npm run dev
7) Kubernetes: see k8s/README.md — apply namespace, secrets, configs, deployments; use StatefulSet/ PVC or managed DBs per service.

DELIVERABLES ZIP
- Include submission.txt, members.txt, readme.txt, report.pdf per module brief.
