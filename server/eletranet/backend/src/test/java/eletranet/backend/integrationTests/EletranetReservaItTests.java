package eletranet.backend.integrationTests;

import eletranet.backend.entity.Person;

import eletranet.backend.entity.Reserva;
import eletranet.backend.repository.PersonRepository;
import eletranet.backend.repository.ReservaRepository;
import eletranet.backend.services.ReservaServices;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
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

import java.util.List;
import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)

public class EletranetReservaItTests {

    @LocalServerPort
    private int port;

    @Container
    public static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13.2")
            .withUsername("eletranet")
            .withPassword("eletranet")
            .withDatabaseName("eletranetItTest");

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private ReservaServices reservaServices;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;



    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.show-sql", () -> "true");
    }
    private String obterToken() {
        return given()
                .contentType(ContentType.URLENC)
                .formParam("username", "Carlos")
                .formParam("password", "123456")
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .extract()
                .path("token");
    }
    private Reserva criarReserva(String token) {
        return given()
                .header("Authorization", "Bearer " + token)
                .param("dataReserva", "2025-06-10")    // formato yyyy-MM-dd
                .param("duracaoReserva", "2")          // confirma no backend o formato exato
                .param("stationID", 1L)                  // confirma que stationID = 1 existe na BD
                .param("horaReserva", "10:00")          // formato HH:mm
                .param("tipoCaregamento", "TIPO2")      // valor válido do enum
                .when()
                .post("/reserva/fazerReserva")
                .then()
                .statusCode(200)
                .extract()
                .as(Reserva.class);
    }
    @Test
    @Order(1)
    void LoguinAndMakeReservationSuccess() {
        RestAssured.port = port;

        // Criar utilizador e autenticar
        Person user = new Person();
        user.setFirstName("Carlos");
        user.setLastName("Mendes");
        user.setEmail("carlos.mendes@example.com");



        user.setPassword(passwordEncoder.encode("123456"));
        personRepository.save(user);

        String token = obterToken();

        assertThat(token).isNotEmpty();
    }

    @Test
    @Order(2)
    void ItTestCriarReservaComSucesso() {
        String token = obterToken();
        String dataReserva = "2025-06-10";
        String horaReserva = "14:00";
        String duracaoReserva = "2";
        String tipoCarregamento = "RAPIDO";

        var response = given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.URLENC)
                .formParam("dataReserva", dataReserva)
                .formParam("duracaoReserva", duracaoReserva)
                .formParam("stationID", "1")
                .formParam("horaReserva", horaReserva)
                .formParam("tipoCaregamento", tipoCarregamento)
                .when()
                .post("/reserva/fazerReserva");

        assertThat(response.statusCode()).isEqualTo(200);
    }

    @Test
    @Order(3)
    void ItTestBuscarReservasDoUsuario() {
        String token = obterToken();

        var response = given()
                .header("Authorization", "Bearer " + token)
                .when()
                .get("/reserva/getReservasByIdUsuario");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.jsonPath().getList("$")).isNotEmpty();
        assertThat(response.jsonPath().getList("$")).size().isEqualTo(1);

    }
    @Test
    @Order(4)
    void ItTestCriarReservaError() {

        String dataReserva = "2025-06-10";
        String horaReserva = "14:00";
        String duracaoReserva = "2";
        String tipoCarregamento = "RAPIDO";


        var response = given()
                .header("Authorization", "Bearer " + "sad")
                .contentType(ContentType.URLENC)
                .formParam("dataReserva", dataReserva)
                .formParam("duracaoReserva", duracaoReserva)
                .formParam("stationID", "1")
                .formParam("horaReserva", horaReserva)
                .formParam("tipoCaregamento", tipoCarregamento)
                .when()
                .post("/reserva/fazerReserva")
                .then().extract().statusCode();
        assertThat(response).isEqualTo(500);

    }
    @Test
    @Order(5)
    void ItTestGetAllReservasWhenUserIsLoggedInReturnUserReservationsStatus200() {
        String token = obterToken();
        System.out.println(token);

        var response = given()
                .header("Authorization", "Bearer " + token)

                .when()
                .get("/reserva/getAll")
                .then().extract().statusCode();
        assertThat(response).isEqualTo(200);

    }
    @Test
    @Order(6)
    void ItTestGetAllReservasWhenUserIsLoggedInReturnNoContentWhenUserDoesNotHaveReservationsStatus204() {
        String token = obterToken();
        Optional<Person> person = personRepository.findByFirstName("Carlos");
        if (person.isPresent()) {
            List<Reserva> reservas = reservaServices.findByIdUsuario(person.get().getId());
            reservaRepository.deleteAll(reservas);
        }


        var response = given()
                .header("Authorization", "Bearer " + token)

                .when()
                .get("/reserva/getAll")
                .then().extract().statusCode();
        assertThat(response).isEqualTo(204);

    }
    @Test
    @Order(7)
    void ItTestManageReservaReserva_ConfirmarDeveRetornar200() {
        System.out.println(reservaRepository.findAll());

        String token = obterToken();
        criarReserva(token);
        given()
                .header("Authorization", "Bearer " + token)
                .param("idReserva", 2L)
                .param("operation", "CONFIRMAR")
                .when()
                .put("/reserva/manageReserva")
                .then()
                .statusCode(200)
                .body(equalTo("Reserva atualiazada com Sucesso"));
    }
    @Test
    @Order(8)
    void ItTestManageReservaReserva_ConcluirReservaPendenteRetornar201() {


        String token = obterToken();
        criarReserva(token);
        given()
                .header("Authorization", "Bearer " + token)
                .param("idReserva", 3L)
                .param("operation", "CONCLUIR")
                .when()
                .put("/reserva/manageReserva")
                .then()
                .statusCode(406)
                .body(equalTo("Erro ao autualizar a reserva"));
    }

}
