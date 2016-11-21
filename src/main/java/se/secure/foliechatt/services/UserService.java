package se.secure.foliechatt.services;

import org.springframework.data.repository.CrudRepository;
import se.secure.foliechatt.domain.User;


public class UserService {


    private CrudRepository <User, Long> repo;

    public User saveUser(User user) {
        return repo.save(user);
    }

}
