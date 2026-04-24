# PowerShell script to start HealthCare Platform backend

Write-Host "=== Starting HealthCare Platform Backend ===" -ForegroundColor Green

# Step 1: Start PostgreSQL
Write-Host "`n[1/3] Starting PostgreSQL..." -ForegroundColor Yellow
cd C:\Users\akobi\IdeaProjects\Health_Care_Platform
docker-compose up -d postgres

# Wait for PostgreSQL
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Step 2: Build and start Auth Service
Write-Host "`n[2/3] Building Auth Service..." -ForegroundColor Yellow
cd C:\Users\akobi\IdeaProjects\Health_Care_Platform\backend\auth-service

# Check if Maven wrapper exists
if (Test-Path ".\mvnw.cmd") {
    Write-Host "Building with Maven wrapper..." -ForegroundColor Gray
    .\mvnw.cmd clean package -DskipTests -q
} else {
    Write-Host "mvnw.cmd not found!" -ForegroundColor Red
    exit 1
}

# Step 3: Run the service
Write-Host "`n[3/3] Starting Auth Service on port 8081..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the service" -ForegroundColor Gray

java -jar target\auth-service-0.0.1-SNAPSHOT.jar
