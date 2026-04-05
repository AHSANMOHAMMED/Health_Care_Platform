FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /build
COPY pom.xml .
COPY services/appointment-service/pom.xml services/appointment-service/
COPY services/appointment-service/src services/appointment-service/src
RUN mvn -f services/appointment-service/pom.xml -B -Dmaven.test.skip=true package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /build/services/appointment-service/target/appointment-service-*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java","-jar","/app/app.jar"]
