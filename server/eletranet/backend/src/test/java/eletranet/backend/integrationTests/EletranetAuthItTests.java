package eletranet.backend.integrationTests;


import eletranet.backend.entity.Person;
import eletranet.backend.repository.PersonRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import static io.restassured.RestAssured.*;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;


@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.MethodName.class)


// Testes de integracao , testando o API REST OS SERVICOS E O REPOSITORIO
public class EletranetAuthItTests {
    @LocalServerPort
    private int port;
    @Container
    public static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:13.2")
            .withUsername("eletranet")
            .withPassword("eletranet")
            .withDatabaseName("eletranetItTest");




    @Autowired
    private PersonRepository personRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.jpa.show-sql", () -> "true");

    }


    @BeforeEach
    void setupRestAssuredPort() {
        RestAssured.port = port;
    }

    // Testa o Controlador e o Repositorio Loguin Sucess
    @Test
    @Order(1)
    void ItTestLoguinSucess(){
        Person ana = new Person();
        ana.setFirstName("Ana");
        ana.setEmail("ana.silva@example.com");
        ana.setPassword(passwordEncoder.encode("password1"));
        personRepository.save(ana);

        // login
        String token =
                given()
                        .contentType(ContentType.URLENC)
                        .formParam("username", ana.getFirstName())
                        .formParam("password", "password1")
                        .when()
                        .post("/auth/login")
                        .then()
                        .statusCode(200)
                        .body("token", notNullValue())
                        .extract()
                        .path("token");

        assertThat(token).isNotBlank();


    }
    // Testa o Controlador e o Repositorio Loguin Sucess

    @Test
    @Order(2)
    void ItTestLoguinFaill(){

        // login
        String token =
                given()
                        .contentType(ContentType.URLENC)
                        .formParam("username", "Ana")
                        .formParam("password", "password12")                        .when()
                        .post("/auth/login")
                        .then()
                        .statusCode(403)
                        .body("token", nullValue())
                        .extract()
                        .path("token");

    assertThat(token).isNull();


    }

    @Test
    @Order(3)
    void ItTestRegisterNewUserDeveRetornar201() {
        String jsonBody = """
            {
                "firstName": "Joao",
                "lastName": "Ferreira",
                "email": "joao.ferreira@example.com",
                "phone": 961234567,
                "password": "supersecure"
            }
        """;

        Response response = given()
                .contentType(ContentType.JSON)
                .body(jsonBody)
                .when()
                .post("/auth/register");

        assertThat(response.getStatusCode()).isEqualTo(201);
    }

    @Test
    @Order(4)

    void ItTestRegisterUserJaExistenteDeveRetornar409() {
        Person ana = new Person();
        ana.setFirstName("Ana");
        ana.setEmail("ana.silva@example.com");
        ana.setPassword(passwordEncoder.encode("password1"));

        Response response = given()
                .contentType(ContentType.JSON)
                .body(ana)
                .when()
                .post("/auth/register");

        assertThat(response.statusCode()).isEqualTo(409); // CONFLICT
    }

}


