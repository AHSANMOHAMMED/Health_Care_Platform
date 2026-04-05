import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + "\n")

K8S_DIR = "k8s/services"

services = [
    { "name": "config-server", "port": 8888 },
    { "name": "service-registry", "port": 8761 },
    { "name": "api-gateway", "port": 8080 },
    { "name": "auth-service", "port": 8081 },
    { "name": "patient-service", "port": 8082 },
    { "name": "doctor-service", "port": 8083 },
    { "name": "appointment-service", "port": 8084 },
    { "name": "payment-service", "port": 8085 },
    { "name": "notification-service", "port": 8086 },
    { "name": "telemedicine-service", "port": 8087 },
    { "name": "ai-service", "port": 8088 },
    { "name": "frontend", "port": 3000 }
]

for s in services:
    name = s["name"]
    port = s["port"]
    
    # Generic env vars block, we can just inject everything via config-server locally,
    # but in actual deployment we map the registry. For assignment, a basic skeleton works.
    
    yaml_content = f"""
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {name}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {name}
  template:
    metadata:
      labels:
        app: {name}
    spec:
      containers:
        - name: {name}
          image: mediconnect-{name}:latest
          imagePullPolicy: Never
          ports:
            - containerPort: {port}
          envFrom:
            - configMapRef:
                name: platform-config
            - secretRef:
                name: platform-secret
---
apiVersion: v1
kind: Service
metadata:
  name: {name}
spec:
  selector:
    app: {name}
  ports:
    - protocol: TCP
      port: {port}
      targetPort: {port}
"""
    write_file(f"{K8S_DIR}/{name}.yaml", yaml_content)

# Ingress
write_file("k8s/ingress.yaml", """
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mediconnect-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
    - http:
        paths:
          - path: /api(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: api-gateway
                port:
                  number: 8080
          - path: /()(.*)
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 3000
""")

print("K8s manifests successfully generated.")
