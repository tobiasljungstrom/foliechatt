package se.secure.foliechatt.services;

import org.springframework.data.jpa.repository.JpaRepository;
import se.secure.foliechatt.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
