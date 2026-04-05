import os

def update_dockerfile(path):
    dockerfile_content = """# Final Run Stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
"""
    with open(path, 'w') as f:
        f.write(dockerfile_content)
    print(f"Updated {path}")

backend_dir = 'backend'
for subdir in os.listdir(backend_dir):
    service_path = os.path.join(backend_dir, subdir)
    if os.path.isdir(service_path):
        dockerfile_path = os.path.join(service_path, 'Dockerfile')
        if os.path.exists(dockerfile_path):
            update_dockerfile(dockerfile_path)

print("All Dockerfiles optimized for pre-built JARs.")
