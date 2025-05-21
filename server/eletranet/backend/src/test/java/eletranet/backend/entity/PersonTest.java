package eletranet.backend.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;
class PersonTest {

    Person personP1;
    Person personP2;
    @BeforeEach
    void setUp() {
        personP1 = new Person("Airton","Moreira","agm@ua.pt",92341233);
        personP2 = new Person("Dovas","Fomes","fomes@ua.pt",92341233);


    }

    @Test
    void TestName(){
        assertThat(personP1.getPhone())
                .isEqualTo(personP2.getPhone());
    }
}