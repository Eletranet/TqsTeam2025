package eletranet.backend.serviceTests;

import eletranet.backend.entity.Person;
import eletranet.backend.services.imp.PersonServicesIMP;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)

class PersonServicesIMPTest {


    private PersonServicesIMP personServices;

    @Mock
    private SecurityContext securityContext;

    @BeforeEach
    void setUp() {
        personServices = new PersonServicesIMP();
    }

    @Test
    void getUserFromContext_returnsPerson_ifAuthenticated() {
        Person mockPerson = new Person();
        Authentication auth = new UsernamePasswordAuthenticationToken(mockPerson, null);

        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        Person result = personServices.getUserFromContext();

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo(auth.getName());
        assertThat(mockPerson).isEqualTo(result);

    }

    @Test
    void getUserFromContext_returnsNull_ifAnonymous() {
        Authentication anonymousAuth = mock(AnonymousAuthenticationToken.class);
        when(securityContext.getAuthentication()).thenReturn(anonymousAuth);
        SecurityContextHolder.setContext(securityContext);

        Person result = personServices.getUserFromContext();

        assertThat(result).isNull();

    }

    @Test
    void getUserFromContext_returnsNull_ifNoAuthentication() {
        when(securityContext.getAuthentication()).thenReturn(null);
        SecurityContextHolder.setContext(securityContext);

        Person result = personServices.getUserFromContext();

        assertThat(result).isNull();
    }

    @Test
    void getUserFromContext_returnsNull_ifPrincipalNotPerson() {
        Authentication auth = new UsernamePasswordAuthenticationToken("notPerson", null);
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        Person result = personServices.getUserFromContext();

        assertThat(result).isNull();
    }
}