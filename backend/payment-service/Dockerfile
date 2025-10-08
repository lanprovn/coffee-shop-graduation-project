FROM maven:3.8.4-openjdk-17-slim AS build

WORKDIR /app

# Copy the entire project
COPY . .

# Build shared-config first, then payment-service
RUN mvn clean install -pl shared-config -am -DskipTests
RUN mvn clean package -pl payment-service -am -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/payment-service/target/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]
