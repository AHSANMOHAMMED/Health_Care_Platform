#!/bin/zsh

# Set the docker environment for Mac
export DOCKER_HOST=unix:///Users/ahsan/.docker/run/docker.sock

# Function to check if a port is in use
check_port() {
    lsof -ti :$1 > /dev/null
    return $?
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pids=$(lsof -ti :$port)
    if [ ! -z "$pids" ]; then
        echo "Killing processes on port $port: $pids"
        echo "$pids" | xargs kill -9
    fi
}

echo "--- Step 1: Infrastructure ---"
# Note: we assume postgres and rabbitmq are already running in Docker.
# If they aren't, this part might fail, but from our checks they are up.
# docker-compose up -d postgres rabbitmq

echo "--- Step 2: Config Server ---"
kill_port 8888
nohup java -Xmx256m -jar backend/config-server/target/config-server-0.0.1-SNAPSHOT.jar > logs/config-server.log 2>&1 &
echo "Waiting for Config Server (8888)..."
while ! check_port 8888; do sleep 2; done
echo "Config Server is UP"

echo "--- Step 3: Service Registry ---"
kill_port 8761
nohup java -Xmx256m -jar backend/service-registry/target/service-registry-0.0.1-SNAPSHOT.jar > logs/service-registry.log 2>&1 &
echo "Waiting for Service Registry (8761)..."
while ! check_port 8761; do sleep 2; done
echo "Service Registry is UP"

echo "--- Step 4: API Gateway ---"
kill_port 8080
export EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://127.0.0.1:8761/eureka/
export SPRING_CONFIG_IMPORT=optional:configserver:http://127.0.0.1:8888/
nohup java -Xmx256m -jar backend/api-gateway/target/api-gateway-0.0.1-SNAPSHOT.jar > logs/api-gateway.log 2>&1 &
echo "Waiting for API Gateway (8080)..."
while ! check_port 8080; do sleep 2; done
echo "API Gateway is UP"

echo "--- Step 5: Domain Microservices ---"
# Environment overrides to securely inject Azure Cloud credentials for Hibernate
export SPRING_DATASOURCE_URL_BASE="jdbc:postgresql://my-dsproject-deploy-2026.postgres.database.azure.com:5432/"
export SPRING_DATASOURCE_USERNAME="adminuser"
export SPRING_DATASOURCE_PASSWORD="Dsproject123"
export SPRING_RABBITMQ_HOST=127.0.0.1

services=(
    "auth-service:8081:auth_db"
    "patient-service:8082:patient_db"
    "doctor-service:8083:doctor_db"
    "appointment-service:8084:appointment_db"
    "payment-service:8085:payment_db"
    "notification-service:8086:none"
    "telemedicine-service:8087:none"
    "ai-service:8088:ai_db"
    "admin-service:8089:none"
)

for s in "${services[@]}"; do
    name=$(echo $s | cut -d: -f1)
    port=$(echo $s | cut -d: -f2)
    db=$(echo $s | cut -d: -f3)
    
    kill_port $port
    
    # Set specific DB URL with clean env variables
    if [ "$db" != "none" ]; then
        export SPRING_DATASOURCE_URL="jdbc:postgresql://my-dsproject-deploy-2026.postgres.database.azure.com:5432/${db}?sslmode=disable"
        export SPRING_DATASOURCE_USERNAME="adminuser"
        export SPRING_DATASOURCE_PASSWORD="Dsproject123"
    else
        unset SPRING_DATASOURCE_URL
        unset SPRING_DATASOURCE_USERNAME
        unset SPRING_DATASOURCE_PASSWORD
    fi
    
    echo "Starting $name on port $port (Memory limited)..."
    nohup java -Xmx256m -jar backend/$name/target/$name-0.0.1-SNAPSHOT.jar > logs/$name.log 2>&1 &
done

echo "All services started. Final verification in progress..."
sleep 15
lsof -ni -P -sTCP:LISTEN | grep -E "808[0-9]|8888|8761"
