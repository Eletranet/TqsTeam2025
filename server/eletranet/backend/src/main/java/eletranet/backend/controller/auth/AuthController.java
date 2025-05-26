package eletranet.backend.controller.auth;

import eletranet.backend.config.TokenProvider;
import eletranet.backend.entity.Person;
import eletranet.backend.services.imp.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.authentication.AuthenticationManager;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")

public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private AuthService authService;
    private TokenProvider tokenService;

    private AuthenticationManager authenticationManager;

    public AuthController(AuthService authService,TokenProvider tokenService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;

    }

    @PostMapping("/register")
    public ResponseEntity<UserDetails> createUser(@RequestBody Person person) {

        UserDetails newUser = authService.registerUser(person) ;

        if (newUser == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
        }

        logger.info("Sucessfully registered new user ");

        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestParam String username, @RequestParam String password) {

        var authToken = new UsernamePasswordAuthenticationToken(username,password);


        Authentication authUser=authenticationManager.authenticate(authToken);

        String token = tokenService.generateAccessToken((Person) authUser.getPrincipal());
        logger.info("User X Sucessfully logged");

        return ResponseEntity.ok(Map.of("token", token, "username", username, "role", "null"));
    }

}
