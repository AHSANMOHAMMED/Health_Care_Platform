FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /build
COPY pom.xml .
COPY services/user-service/pom.xml services/user-service/
COPY services/user-service/src services/user-service/src
RUN mvn -f services/user-service/pom.xml -B -Dmaven.test.skip=true package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /build/services/user-service/target/user-service-*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app/app.jar"]
