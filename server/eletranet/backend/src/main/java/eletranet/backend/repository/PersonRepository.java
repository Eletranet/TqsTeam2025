package eletranet.backend.repository;

import eletranet.backend.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findByFirstName(String firstName);
}
