package eletranet.backend.contollersTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import eletranet.backend.config.SecurityFilter;
import eletranet.backend.config.TokenProvider;
import eletranet.backend.controller.auth.AuthController;
import eletranet.backend.entity.Person;
import eletranet.backend.services.imp.AuthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {
    @MockitoBean
    private TokenProvider tokenProvider;
    @MockitoBean
    private SecurityFilter securityFilter;
    @MockitoBean
    private AuthenticationManager authenticationManager;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    // Teste para o endpoint de registo (register)
    @Test
    void createUser_success() throws Exception {
        Person person = new Person();
        person.setFirstName("testuser");
        person.setPassword("password");

        UserDetails mockedUserDetails = org.springframework.security.core.userdetails.User
                .withUsername("testuser")
                .password("password")
                .roles("USER")
                .build();

        // Simula o registo bem-sucedido
        Mockito.when(authService.registerUser(any(Person.class))).thenReturn(mockedUserDetails);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(person)))
                .andExpect(status().isCreated())
                .andExpect(content().string("")); // Como no controller está a retornar null no body
    }

    // Teste para registo com conflito (user já existe)
    @Test
    void createUser_conflict() throws Exception {
        Person person = new Person();
        person.setFirstName("testuser");
        person.setPassword("password");

        // Simula retorno null, indicando que o utilizador já existe
        Mockito.when(authService.registerUser(any(Person.class))).thenReturn(null);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(person)))
                .andExpect(status().isConflict())
                .andExpect(status().reason("User already exists"));
    }

    @Test
    void loginUser_success() throws Exception {
        String username = "testuser";
        String password = "password";
        String fakeToken = "fake-jwt-token";

        // Mock da autenticação
        Authentication auth = Mockito.mock(Authentication.class);

        // Mock do Person retornado pelo auth.getPrincipal()
        Person principal = new Person();
        principal.setFirstName(username);

        Mockito.when(auth.getPrincipal()).thenReturn(principal);

        // Simula autenticação
        Mockito.when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);

        // Simula geração do token
        Mockito.when(tokenProvider.generateAccessToken(principal)).thenReturn(fakeToken);

        mockMvc.perform(post("/auth/login")
                        .param("username", username)
                        .param("password", password))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(fakeToken))
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.role").value("null"));
    }
}