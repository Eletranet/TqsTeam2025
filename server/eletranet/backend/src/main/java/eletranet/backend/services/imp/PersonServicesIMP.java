package eletranet.backend.services.imp;

import eletranet.backend.entity.Person;
import eletranet.backend.services.PersonServices;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PersonServicesIMP implements PersonServices {


    @Override
    public Person getUserFromContext() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof AnonymousAuthenticationToken || authentication == null) {
            return null;
        }

        if (authentication.getPrincipal() instanceof Person person) {
            return person;
        }

        return null;
    }
}
