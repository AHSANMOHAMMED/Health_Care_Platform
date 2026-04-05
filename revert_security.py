import os

services = ['patient', 'doctor', 'appointment', 'payment', 'notification', 'telemedicine', 'ai']

for service in services:
    pkg = service.replace("-", "_") + "_service"
    cls_name = service.capitalize() + "ServiceApplication"
    file_path = f"backend/{service}-service/src/main/java/com/mediconnect/{pkg}/{cls_name}.java"
    
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            content = f.read()
            
        import re
        content = re.sub(r'@SpringBootApplication\(exclude = \{[^\}]+\}\)', '@SpringBootApplication', content)
        
        with open(file_path, "w") as f:
            f.write(content)

print("Reverted exclude from SpringBootApplication")
