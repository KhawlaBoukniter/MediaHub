FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache maven
COPY pom.xml ./pom.xml
COPY discovery-server/pom.xml ./discovery-server/pom.xml
COPY config-server/pom.xml ./config-server/pom.xml
COPY user-service/pom.xml ./user-service/pom.xml
COPY media-service/pom.xml ./media-service/pom.xml
COPY subscription-service/pom.xml ./subscription-service/pom.xml
COPY subscription-service/src ./subscription-service/src
RUN mvn clean package -DskipTests -pl subscription-service -am

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/subscription-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
