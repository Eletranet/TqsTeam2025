package eletranet.backend.services.imp;

import eletranet.backend.entity.Person;
import eletranet.backend.repository.PersonRepository;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService implements UserDetailsService {
    private PersonRepository personRepository;
    public AuthService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Person> person = personRepository.findByFirstName(username);
        if (person.isPresent()) {
            return person.get();
        }else {
            throw new UsernameNotFoundException("Invalid username");
        }
    }

    public UserDetails registerUser(Person user) throws AuthenticationException {
        Optional<Person> person = personRepository.findByFirstName(user.getFirstName());
        if (person.isPresent()) {
            return null;
        }else{
            String encryptedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
            user.setPassword(encryptedPassword);
            personRepository.save(user);
            return user;
        }

    }
}
