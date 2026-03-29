FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /build
COPY pom.xml .
COPY services/telemedicine-service/pom.xml services/telemedicine-service/
COPY services/telemedicine-service/src services/telemedicine-service/src
RUN mvn -f services/telemedicine-service/pom.xml -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /build/services/telemedicine-service/target/telemedicine-service-*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java","-jar","/app/app.jar"]
