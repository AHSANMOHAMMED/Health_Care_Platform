FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /build
COPY pom.xml .
COPY services/doctor-service/pom.xml services/doctor-service/
COPY services/doctor-service/src services/doctor-service/src
RUN mvn -f services/doctor-service/pom.xml -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /build/services/doctor-service/target/doctor-service-*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java","-jar","/app/app.jar"]
