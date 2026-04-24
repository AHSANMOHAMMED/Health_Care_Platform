#!/bin/bash

# MediConnect Lanka - Azure Deployment Script
# This script uses Azure Container Registry Tasks (ACR Tasks) to build images in the cloud
# No local Docker required!

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to script directory (project root)
cd "$SCRIPT_DIR"

# Configuration
ACR_NAME="healthcaredsmediconnectreg"
RESOURCE_GROUP="my-assignment-group"
CLUSTER_NAME="mediconnect-aks"
FRONTEND_URL="https://mediconnect-lanka.azurewebsites.net"
API_URL="https://mediconnect-api-gateway.azurewebsites.net"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== MediConnect Lanka - Azure Cloud Deployment ===${NC}"
echo "This script builds images in Azure Container Registry (no local Docker needed)"
echo ""

# Login to Azure
echo -e "${YELLOW}Step 1: Logging into Azure...${NC}"
az login
az account set --subscription "$(az account list --query '[0].name' -o tsv)"
echo -e "${GREEN}✓ Azure login successful${NC}"
echo ""

# Function to build and push a service
build_service() {
    local service=$1
    local dir=$2
    
    echo -e "${YELLOW}Building $service in Azure Cloud...${NC}"
    
    # Try ACR build - it may fail on Azure for Students subscription
    if [ "$service" == "frontend" ]; then
        if az acr build \
            --registry $ACR_NAME \
            --image mediconnect-$service:latest \
            --build-arg VITE_API_GATEWAY_URL=$API_URL/api \
            $dir 2>&1; then
            echo -e "${GREEN}✓ $service built and pushed${NC}"
        else
            echo -e "${RED}✗ ACR Tasks not available on your subscription${NC}"
            return 1
        fi
    else
        if az acr build \
            --registry $ACR_NAME \
            --image mediconnect-$service:latest \
            $dir 2>&1; then
            echo -e "${GREEN}✓ $service built and pushed${NC}"
        else
            echo -e "${RED}✗ ACR Tasks not available on your subscription${NC}"
            return 1
        fi
    fi
}

# Check if ACR Tasks is available (Azure for Students doesn't support it)
echo -e "${YELLOW}Step 2: Checking ACR Tasks availability...${NC}"
if ! az acr task list --registry $ACR_NAME &>/dev/null; then
    echo -e "${RED}⚠️  ACR Tasks is NOT available on your Azure for Students subscription!${NC}"
    echo ""
    echo -e "${YELLOW}👉 RECOMMENDED: Use GitHub Actions instead${NC}"
    echo "   See: deploy-to-azure-GITHUB.md"
    echo ""
    echo "Steps:"
    echo "  1. Set GitHub Secrets: REGISTRY_USERNAME, REGISTRY_PASSWORD, KUBE_CONFIG_DATA"
    echo "  2. Push code to GitHub: git push origin main"
    echo "  3. GitHub Actions will build and deploy automatically"
    echo ""
    echo -e "${YELLOW}Get your ACR password:${NC}"
    echo "  az acr credential show --name healthcaredsmediconnectreg --query 'passwords[0].value' -o tsv"
    echo ""
    exit 1
fi

# Build all backend services
echo -e "${YELLOW}Step 2: Building Backend Services in Azure Cloud...${NC}"
echo "This uses ACR Tasks - builds happen in Azure, not locally"
echo ""

services=(
    "auth-service:./backend/auth-service"
    "patient-service:./backend/patient-service"
    "doctor-service:./backend/doctor-service"
    "appointment-service:./backend/appointment-service"
    "payment-service:./backend/payment-service"
    "notification-service:./backend/notification-service"
    "ai-service:./backend/ai-service"
    "admin-service:./backend/admin-service"
    "api-gateway:./backend/api-gateway"
    "config-server:./backend/config-server"
    "service-registry:./backend/service-registry"
    "telemedicine-service:./backend/telemedicine-service"
    "prescription-service:./backend/prescription-service"
)

for service_pair in "${services[@]}"; do
    IFS=':' read -r service dir <<< "$service_pair"
    build_service "$service" "$dir"
done

echo ""

# Build frontend
echo -e "${YELLOW}Step 3: Building Frontend in Azure Cloud...${NC}"
build_service "frontend" "./frontend"
echo ""

# Get AKS credentials
echo -e "${YELLOW}Step 4: Configuring kubectl for AKS...${NC}"
az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --overwrite-existing
echo -e "${GREEN}✓ kubectl configured${NC}"
echo ""

# Deploy infrastructure
echo -e "${YELLOW}Step 5: Deploying Infrastructure (ConfigMaps, Secrets)...${NC}"
kubectl apply -f k8s/infrastructure/
echo -e "${GREEN}✓ Infrastructure deployed${NC}"
echo ""

# Deploy services
echo -e "${YELLOW}Step 6: Deploying Microservices...${NC}"
kubectl apply -f k8s/services/
echo -e "${GREEN}✓ Services deployed${NC}"
echo ""

# Deploy ingress
echo -e "${YELLOW}Step 7: Deploying Ingress...${NC}"
kubectl apply -f k8s/ingress.yaml
echo -e "${GREEN}✓ Ingress deployed${NC}"
echo ""

# Wait for rollout
echo -e "${YELLOW}Step 8: Waiting for rollouts to complete...${NC}"
sleep 10

# Restart deployments to pull new images
echo "Restarting deployments to use new images..."
kubectl rollout restart deployment/frontend
kubectl rollout restart deployment/auth-service
kubectl rollout restart deployment/api-gateway
kubectl rollout restart deployment/patient-service
kubectl rollout restart deployment/doctor-service
kubectl rollout restart deployment/appointment-service
kubectl rollout restart deployment/payment-service
kubectl rollout restart deployment/notification-service
kubectl rollout restart deployment/ai-service
kubectl rollout restart deployment/admin-service
kubectl rollout restart deployment/telemedicine-service
kubectl rollout restart deployment/prescription-service
kubectl rollout restart deployment/config-server
kubectl rollout restart deployment/service-registry

echo ""

# Check status
echo -e "${YELLOW}Step 9: Checking deployment status...${NC}"
echo ""
echo "Pods:"
kubectl get pods
echo ""
echo "Services:"
kubectl get services
echo ""
echo "Ingress:"
kubectl get ingress

echo ""
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo ""
echo "Your application should be available at:"
echo "  Frontend: $FRONTEND_URL"
echo "  API: $API_URL"
echo ""
echo "To check logs:"
echo "  kubectl logs -f deployment/auth-service"
echo ""
echo "To update OAuth credentials later:"
echo "  kubectl create secret generic platform-secret \\"
echo "    --from-literal=GOOGLE_CLIENT_SECRET=your-secret \\"
echo "    --from-literal=FACEBOOK_APP_SECRET=your-secret \\"
echo "    --dry-run=client -o yaml | kubectl apply -f -"
