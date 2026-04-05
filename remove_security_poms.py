import os
import re

services = ['patient', 'doctor', 'appointment', 'payment', 'notification', 'telemedicine', 'ai']

for service in services:
    pom_path = f"backend/{service}-service/pom.xml"
    if os.path.exists(pom_path):
        with open(pom_path, "r") as f:
            content = f.read()

        # Regex to safely remove the spring-boot-starter-security block
        content = re.sub(
            r'<dependency>\s*<groupId>org\.springframework\.boot</groupId>\s*<artifactId>spring-boot-starter-security</artifactId>\s*</dependency>',
            '', content, flags=re.MULTILINE
        )
        
        # Also remove spring-boot-starter-security-test
        content = re.sub(
            r'<dependency>\s*<groupId>org\.springframework\.boot</groupId>\s*<artifactId>spring-boot-starter-security-test</artifactId>\s*<scope>test</scope>\s*</dependency>',
            '', content, flags=re.MULTILINE
        )

        with open(pom_path, "w") as f:
            f.write(content)

print("Removed spring-security dependencies from downstream services.")
