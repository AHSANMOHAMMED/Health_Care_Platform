#!/bin/bash
set -e

mkdir -p backend

unzip -o config-server.zip -d backend/config-server && rm -f config-server.zip

curl -s https://start.spring.io/starter.zip -d dependencies=cloud-eureka-server,actuator -d type=maven-project -d javaVersion=21 -d groupId=com.mediconnect -d artifactId=service-registry -d name=service-registry -o service-registry.zip && unzip -o service-registry.zip -d backend/service-registry && rm service-registry.zip

curl -s https://start.spring.io/starter.zip -d dependencies=cloud-gateway,cloud-eureka,actuator -d type=maven-project -d javaVersion=21 -d groupId=com.mediconnect -d artifactId=api-gateway -d name=api-gateway -o api-gateway.zip && unzip -o api-gateway.zip -d backend/api-gateway && rm api-gateway.zip

curl -s https://start.spring.io/starter.zip -d dependencies=web,data-jpa,postgresql,flyway,cloud-eureka,cloud-config-client,actuator,security -d type=maven-project -d javaVersion=21 -d groupId=com.mediconnect -d artifactId=auth-service -d name=auth-service -o auth-service.zip && unzip -o auth-service.zip -d backend/auth-service && rm auth-service.zip

curl -s https://start.spring.io/starter.zip -d dependencies=web,data-jpa,postgresql,flyway,cloud-eureka,cloud-config-client,actuator,security,cloud-feign -d type=maven-project -d javaVersion=21 -d groupId=com.mediconnect -d artifactId=patient-service -d name=patient-service -o patient-service.zip && unzip -o patient-service.zip -d backend/patient-service && rm patient-service.zip

curl -s https://start.spring.io/starter.zip -d dependencies=web,data-jpa,postgresql,flyway,cloud-eureka,cloud-config-client,actuator,security,cloud-feign -d type=maven-project -d javaVersion=21 -d groupId=com.mediconnect -d artifactId=doctor-service -d name=doctor-service -o doctor-service.zip && unzip -o doctor-service.zip -d backend/doctor-service && rm doctor-service.zip

curl -s https://start.spring.io/starter.zip -d dependencies=web,data-jpa,postgresql,flyway,cloud-eureka,cloud-config-client,actuator,security,cloud-feign,amqp -d type=maven-project -d javaVersion=21 -d groupId=com.mediconnect -d artifactId=appointment-service -d name=appointment-service -o appointment-service.zip && unzip -o appointment-service.zip -d backend/appointment-service && rm appointment-service.zip

curl -s https://start.spring.io/starter.zip -d dependencies=web,cloud-eureka,cloud-config-client,actuator,security -d type=maven-project -d javaVersion=21 -d groupId=com.mediconnect -d artifactId=telemedicine-service -d name=telemedicine-service -o telemedicine-service.zip && unzip -o telemedicine-service.zip -d backend/telemedicine-service && rm telemedicine-service.zip

curl -s https://start.spring.io/starter.zip -d dependencies=web,data-jpa,postgresql,flyway,cloud-eureka,cloud-config-client,actuator,security,cloud-feign,amqp -d type=maven-project -d javaVersion=21 -d groupId=com.mediconnect -d artifactId=payment-service -d name=payment-service -o payment-service.zip && unzip -o payment-service.zip -d backend/payment-service && rm payment-service.zip

curl -s https://start.spring.io/starter.zip -d dependencies=web,cloud-eureka,cloud-config-client,actuator,security,amqp,mail -d type=maven-project -d javaVersion=21 -d groupId=com.mediconnect -d artifactId=notification-service -d name=notification-service -o notification-service.zip && unzip -o notification-service.zip -d backend/notification-service && rm notification-service.zip

curl -s https://start.spring.io/starter.zip -d dependencies=web,data-jpa,postgresql,flyway,cloud-eureka,cloud-config-client,actuator,security,cloud-feign -d type=maven-project -d javaVersion=21 -d groupId=com.mediconnect -d artifactId=ai-service -d name=ai-service -o ai-service.zip && unzip -o ai-service.zip -d backend/ai-service && rm ai-service.zip
