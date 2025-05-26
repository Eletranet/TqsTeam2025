package eletranet.backend.serviceTests;

import eletranet.backend.entity.Person;
import eletranet.backend.repository.PersonRepository;
import eletranet.backend.services.imp.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mock.Strictness;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)

class AuthServiceTest {
    @Mock(strictness = Strictness.LENIENT)
    private PersonRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private Person person1;




    @BeforeEach
    void setup(){

        person1 = new Person("Pedro","GOmes","aga@asd.pt",999123123,"dasdsadad");
        Mockito.when(userRepository.save(person1)).thenReturn(person1);

    }

    @Test
    void whenRegisterNewUser_thenReturnNewUserDetails() {
        // Mock para dizer que não existe nenhum user com esse firstName
        Mockito.when(userRepository.findByFirstName(person1.getFirstName())).thenReturn(Optional.empty());

        UserDetails registered = authService.registerUser(person1);

        assertNotNull(registered);
        assertEquals(person1.getFirstName(), ((Person)registered).getFirstName());
        assertNotEquals("password123", ((Person)registered).getPassword()); // password deve estar encriptada
        verify(userRepository,times(1)).findByFirstName(person1.getFirstName());
    }


    @Test
    void whenRegisterExistingUser_thenReturnExistsError() {
        Mockito.when(userRepository.findByFirstName(person1.getFirstName())).thenReturn(Optional.of(person1));
        UserDetails registered = authService.registerUser(person1);
        assertNull(registered);
        verify(userRepository,times(1)).findByFirstName(person1.getFirstName());

    }

    @Test
    void whenSearchValidUserName_thenUserShouldBeFound() {
        Mockito.when(userRepository.findByFirstName(person1.getFirstName())).thenReturn(Optional.of(person1));
        UserDetails found = authService.loadUserByUsername(person1.getFirstName());
        assertThat(found.getUsername()).isEqualTo(person1.getUsername());


    }

}