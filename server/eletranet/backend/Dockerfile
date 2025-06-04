FROM maven:3.8.5-openjdk-17

WORKDIR /Backend

COPY . .

ENTRYPOINT ["mvn", "spring-boot:run" , "-B","-Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn" , "-Dmaven.test.skip"]
