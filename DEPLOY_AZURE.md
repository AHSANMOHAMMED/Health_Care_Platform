# MediConnect Lanka - Azure Deployment Guide

## ⚠️ IMPORTANT: ACR Tasks Not Available

Your **Azure for Students** subscription does **NOT support ACR Tasks**.

### ✅ Use GitHub Actions Instead (RECOMMENDED)

See: **[deploy-to-azure-GITHUB.md](./deploy-to-azure-GITHUB.md)** for complete GitHub Actions instructions.

### 🔧 Alternative: Manual Deploy with Docker

If you have Docker locally, see manual commands below.

---

## 🚀 Quick Deploy Options

### Option 1: GitHub Actions (Easiest - No Docker Needed)
1. Set 3 GitHub Secrets: `REGISTRY_USERNAME`, `REGISTRY_PASSWORD`, `KUBE_CONFIG_DATA`
2. Push to `main` branch
3. GitHub Actions builds and deploys automatically

### Option 2: Local Deploy Script (Requires ACR Tasks - NOT available on your subscription)
This will fail with `TasksOperationsNotAllowed` error.

### Option 3: Manual Docker Commands (Requires Docker locally)
Build and push images from your machine using Docker.

### 1. Environment Configuration

Your `.env.production` is already configured with:
- ✅ Azure PostgreSQL Database
- ✅ SMTP (Gmail) - Email verification ready
- ✅ Azure Container Registry (ACR)
- ✅ Gemini AI API Key
- ⚠️ OAuth (Google/Facebook) - **Add your credentials**

**Update OAuth credentials in `.env.production`:**
```bash
GOOGLE_CLIENT_ID=your-real-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-real-google-secret
FACEBOOK_APP_ID=your-real-facebook-app-id
FACEBOOK_APP_SECRET=your-real-facebook-secret
```

### 2. Build and Push to ACR (Cloud Build - No Docker Required!)

#### Option A: Use the automated script (Recommended)
```bash
# Make script executable and run
chmod +x deploy-to-azure.sh
./deploy-to-azure.sh
```

#### Option B: Manual commands
```bash
# Login to Azure
az login

# Build all backend services in Azure cloud (no local tools needed)
for service in auth-service patient-service doctor-service appointment-service payment-service notification-service ai-service admin-service api-gateway service-registry config-server telemedicine-service prescription-service; do
  echo "Building $service in Azure Cloud..."
  az acr build \
    --registry healthcaredsmediconnectreg \
    --image mediconnect-$service:latest \
    --file Dockerfile \
    ./backend/$service
done

# Build frontend in Azure Cloud
az acr build \
  --registry healthcaredsmediconnectreg \
  --image mediconnect-frontend:latest \
  --build-arg VITE_API_GATEWAY_URL=https://mediconnect-api-gateway.azurewebsites.net/api \
  --file Dockerfile \
  ./frontend
```

### 3. Deploy to AKS

```bash
# Get AKS credentials
az aks get-credentials --resource-group my-assignment-group --name mediconnect-aks

# Apply infrastructure (ConfigMaps, Secrets, RabbitMQ)
kubectl apply -f k8s/infrastructure/

# Apply services
kubectl apply -f k8s/services/

# Apply ingress
kubectl apply -f k8s/ingress.yaml

# Verify deployments
kubectl get pods
kubectl get services
kubectl get ingress
```

### 4. Update Secrets (If OAuth Credentials Added)

```bash
# Update platform-secret with OAuth credentials
kubectl create secret generic platform-secret \
  --from-literal=GOOGLE_CLIENT_SECRET=your-secret \
  --from-literal=FACEBOOK_APP_SECRET=your-secret \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart auth-service to pick up new secrets
kubectl rollout restart deployment/auth-service
```

### 5. GitHub Actions Auto-Deploy (No Docker Required!)

Your GitHub workflow `.github/workflows/deploy-azure.yml` is configured to use **ACR Tasks** - images build in Azure cloud, not locally!

**Required GitHub Secrets:**
1. `AZURE_CREDENTIALS` - Service principal credentials
2. `KUBE_CONFIG_DATA` - Base64 encoded kubeconfig

**To set up AZURE_CREDENTIALS:**
```bash
# Create service principal with contributor access
az ad sp create-for-rbac \
  --name "github-actions-mediconnect" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/my-assignment-group \
  --sdk-auth

# Copy the JSON output and paste as AZURE_CREDENTIALS secret in GitHub
```

**To get KUBE_CONFIG_DATA:**
```bash
az aks get-credentials --resource-group my-assignment-group --name mediconnect-aks
cat ~/.kube/config | base64 | tr -d '\n'
```

### 6. Verify Deployment

```bash
# Check pod status
kubectl get pods -w

# Check logs
kubectl logs -f deployment/auth-service

# Test API
curl https://mediconnect-api-gateway.azurewebsites.net/api/auth/validate?token=test

# Check ingress
kubectl get ingress
```

## 🔐 Authentication Features (Now Active)

### Email Verification
- Users receive verification email after registration
- Link valid for 24 hours
- Users cannot login without verifying email

### Password Reset
- Users can request password reset
- Secure token sent via email (valid 1 hour)
- New password form at `/reset-password?token=xxx`

### OAuth Login
- Google Sign-In (configure credentials)
- Facebook Login (configure credentials)
- Apple Sign-In (requires Apple Developer account)

## 🗄️ Database Tables (Auto-Created)

Auth service creates these tables on startup:
- `user_credentials` - Users with `email_verified` column
- `verification_token` - Email verification tokens
- `password_reset_token` - Password reset tokens

## 📧 Email Configuration

Your Gmail SMTP is configured:
- **Email:** ahsanmohammed828@gmail.com
- **App Password:** hkvrlmtnjkvnifox
- **Port:** 587 (TLS)

## 🔧 Troubleshooting

### Email Not Sending
```bash
# Check auth-service logs
kubectl logs deployment/auth-service | grep -i email

# Verify SMTP settings in pod
kubectl exec -it deployment/auth-service -- env | grep SMTP
```

### OAuth Not Working
```bash
# Verify OAuth env vars
kubectl exec -it deployment/auth-service -- env | grep -E "GOOGLE|FACEBOOK"

# Check for "OAuth not configured" in logs
kubectl logs deployment/auth-service | grep -i oauth
```

### Pods Not Starting
```bash
# Check events
kubectl get events --sort-by='.lastTimestamp'

# Check specific pod
kubectl describe pod <pod-name>
```

## 🌐 Frontend Routes (All Implemented)

| Route | Page | Status |
|-------|------|--------|
| `/login` | Login with OAuth | ✅ Active |
| `/register` | Register with verification | ✅ Active |
| `/verify-email` | Email verification | ✅ Active |
| `/reset-password` | Password reset | ✅ Active |
| `/ai-symptom` | AI Symptom Checker | ✅ Active |
| `/doctor-search` | Find Doctors | ✅ Active |
| `/appointment-scheduling` | Calendar | ✅ Active |
| `/health-records` | EHR | ✅ Active |
| `/wearables` | Device Integration | ✅ Active |
| `/data-export` | Data Export | ✅ Active |
| `/doctor-reviews` | Doctor Reviews | ✅ Active |
| `/realtime-consultation` | Video Consultation | ✅ Active |
| `/symptom-checker` | Basic Symptom Check | ✅ Active |

## 📞 Support

- **Azure Portal:** https://portal.azure.com
- **AKS Dashboard:** `az aks browse --resource-group my-assignment-group --name mediconnect-aks`
- **Container Registry:** healthcaredsmediconnectreg.azurecr.io
