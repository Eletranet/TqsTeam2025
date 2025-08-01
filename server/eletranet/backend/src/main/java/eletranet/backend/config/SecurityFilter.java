package eletranet.backend.config;


import eletranet.backend.entity.Person;
import eletranet.backend.repository.PersonRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Generated
@Component
public class SecurityFilter extends OncePerRequestFilter {
    TokenProvider tokenService;
    PersonRepository userRepository;

    public SecurityFilter(TokenProvider tokenService, PersonRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var token = this.recoverToken(request);

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        var tokenSubject = tokenService.validateToken(token);


        UserDetails user = null;
        Optional<Person> userFound=userRepository.findByFirstName(tokenSubject);
        if(userFound.isPresent()) {
            user = userFound.get();
        }

        if (user == null) {
            filterChain.doFilter(request, response);
            return;
        }
        var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null)
            return null;
        return authHeader.replace("Bearer ", "");
    }
}
