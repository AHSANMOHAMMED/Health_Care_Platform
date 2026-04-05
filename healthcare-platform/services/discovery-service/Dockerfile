FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /build
COPY pom.xml .
COPY services/discovery-service/pom.xml services/discovery-service/
COPY services/discovery-service/src services/discovery-service/src
RUN mvn -f services/discovery-service/pom.xml -B -Dmaven.test.skip=true package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /build/services/discovery-service/target/discovery-service-*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java","-jar","/app/app.jar"]
