FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /build
COPY pom.xml .
COPY services/ai-service/pom.xml services/ai-service/
COPY services/ai-service/src services/ai-service/src
RUN mvn -f services/ai-service/pom.xml -B -Dmaven.test.skip=true package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /build/services/ai-service/target/ai-service-*.jar app.jar
EXPOSE 8087
ENTRYPOINT ["java","-jar","/app/app.jar"]
