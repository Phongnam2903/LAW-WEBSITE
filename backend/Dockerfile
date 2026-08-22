# Used only by `docker compose --profile full up --build` (Task 08). Default local
# development runs the backend natively via `./mvnw spring-boot:run` against the
# `mysql`/`minio` services this compose file also defines — see
# docs/technical-foundation/08-docker-development.md for why.

FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline
COPY src src
RUN chmod +x mvnw && ./mvnw -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
