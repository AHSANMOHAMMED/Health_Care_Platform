import os

services = ['patient', 'doctor', 'appointment', 'payment', 'notification', 'telemedicine', 'ai']

for service in services:
    pkg = service.replace("-", "_") + "_service"
    cls_name = service.capitalize() + "ServiceApplication"
    file_path = f"backend/{service}-service/src/main/java/com/mediconnect/{pkg}/{cls_name}.java"
    
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            content = f.read()
            
        if "SecurityAutoConfiguration" not in content:
            # Add exclude
            content = content.replace("@SpringBootApplication", 
                "@SpringBootApplication(exclude = {org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class, org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class})")
            with open(file_path, "w") as f:
                f.write(content)

print("Spring Security auto-configuration disabled on downstream microservices.")
