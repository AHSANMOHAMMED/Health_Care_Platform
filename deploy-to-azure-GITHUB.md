# Azure Deployment via GitHub Actions (RECOMMENDED)

## ⚠️ Issue: ACR Tasks Not Available

Your Azure for Students subscription **does not support ACR Tasks**. The error was:
```
(TasksOperationsNotAllowed) ACR Tasks requests for the registry healthcaredsmediconnectreg are not permitted.
```

## ✅ Solution: Use GitHub Actions

GitHub Actions has Docker and will build/push images for you!

---

## 🚀 Quick Deploy via GitHub Actions

### 1. Configure GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `REGISTRY_USERNAME` | healthcaredsmediconnectreg | Your ACR registry name |
| `REGISTRY_PASSWORD` | (password) | Azure Portal → ACR → Access Keys → password |
| `KUBE_CONFIG_DATA` | (base64 string) | `cat ~/.kube/config \| base64 \| tr -d '\n'` |

### 2. Get ACR Password

```bash
# Login to Azure
az login

# Get ACR password
az acr credential show --name healthcaredsmediconnectreg --query "passwords[0].value" -o tsv
```

Copy this password as `REGISTRY_PASSWORD` in GitHub secrets.

### 3. Get KUBE_CONFIG_DATA

```bash
# Get AKS credentials
az aks get-credentials --resource-group my-assignment-group --name mediconnect-aks

# Encode to base64
cat ~/.kube/config | base64 | tr -d '\n'
```

Copy the entire output as `KUBE_CONFIG_DATA` in GitHub secrets.

### 4. Push to Main Branch

Once secrets are set, just push your code:

```bash
git add .
git commit -m "Update for Azure deployment"
git push origin main
```

GitHub Actions will automatically:
1. Build all 13 backend services with Maven
2. Build frontend with Node.js
3. Build Docker images
4. Push to Azure Container Registry
5. Deploy to AKS

---

## 📊 Monitor Deployment

Go to your GitHub repo → Actions tab to see the build progress.

---

## 🔧 Alternative: Manual Deploy with Docker

If you have Docker locally available, you can build and push manually:

```bash
# Login to ACR (requires Docker)
az acr login --name healthcaredsmediconnectreg

# Build and push auth-service
cd backend/auth-service
docker build -t healthcaredsmediconnectreg.azurecr.io/mediconnect-auth-service:latest .
docker push healthcaredsmediconnectreg.azurecr.io/mediconnect-auth-service:latest

# Repeat for other services...
```

---

## ✅ What's Already Configured

- ✅ All 13 backend services
- ✅ Frontend with production API URL
- ✅ SMTP email verification ready
- ✅ OAuth configuration ready
- ✅ Kubernetes manifests ready

Just set the 3 GitHub secrets and push! 🎉
