# Use an OpenJDK runtime image
FROM docker.io/openjdk:17.0.2-slim-buster

# Set the working directory
WORKDIR /app

# Copy only the Gradle files first to take advantage of Docker layer caching
COPY build.gradle .
COPY settings.gradle .
COPY gradle ./gradle
COPY gradlew .

# Grant execute permissions to the Gradle wrapper JAR file
RUN chmod +x ./gradlew

# Copy the source code
COPY src ./src

# Build the application using the Gradle wrapper
RUN ./gradlew build -x test

# Expose the port that your Spring Boot app is running on
EXPOSE 8080

# Command to run your Spring Boot application
CMD ["java", "-jar", "build/libs/Pantry-0.0.1-SNAPSHOT.jar"]
