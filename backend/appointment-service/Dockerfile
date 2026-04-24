# Build Stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first for layer caching
RUN mvn dependency:go-offline -B || true
COPY src ./src
RUN mvn package -Dmaven.test.skip=true

# Run Stage
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
