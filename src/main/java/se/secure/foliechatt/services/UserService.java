package se.secure.foliechatt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;
import se.secure.foliechatt.domain.User;


@Service
public class UserService {

    @Autowired
    UserRepository repo;

    public User saveUser(User user) {
        return repo.save(user);
    }

}
