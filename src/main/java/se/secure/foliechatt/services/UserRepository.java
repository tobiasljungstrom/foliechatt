package se.secure.foliechatt.services;

import org.springframework.data.jpa.repository.JpaRepository;
import se.secure.foliechatt.domain.LoginAttemptDTO;
import se.secure.foliechatt.domain.User;

import java.util.Random;

public interface UserRepository extends JpaRepository<User, Long> {
    default boolean isAuthorizedForLogin(LoginAttemptDTO loginAttempt) {
        //TODO: make real logic, maybe in a named query.
        return new Random(System.currentTimeMillis()).nextBoolean();
    }
}
