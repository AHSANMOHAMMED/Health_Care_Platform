FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /build
COPY pom.xml .
COPY services/payment-service/pom.xml services/payment-service/
COPY services/payment-service/src services/payment-service/src
RUN mvn -f services/payment-service/pom.xml -B -Dmaven.test.skip=true package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /build/services/payment-service/target/payment-service-*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java","-jar","/app/app.jar"]
