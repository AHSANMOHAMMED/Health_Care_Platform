# Kubernetes samples

These manifests illustrate a typical deployment layout. Adjust images, secrets, and storage classes for your cluster.

## Minikube (local images)

1. Build Docker images from repo root (`healthcare-platform/`) using the same Dockerfiles as Compose.  
2. Load into Minikube:

```bash
minikube image load healthcare/discovery-service:latest
# repeat per service...
```

3. Replace placeholder image names in `deployments.yaml` with your local tags.  
4. `kubectl apply -f namespace.yaml -f configmap.yaml -f deployments.yaml`

For real clusters, use a registry (GHCR, ECR, GCR) and reference image pull secrets.

## StatefulSets

Production PostgreSQL should use **StatefulSet** + **PersistentVolumeClaim** (one DB per microservice) or managed RDS/Cloud SQL. The sample `postgres-statefulset.yaml` shows a single-instance pattern for one database only — duplicate per service with distinct PVCs and services in practice.
