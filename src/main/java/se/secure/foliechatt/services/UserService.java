package se.secure.foliechatt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;
import se.secure.foliechatt.domain.LoginAttemptDTO;
import se.secure.foliechatt.domain.User;

import java.util.List;


@Service
public class UserService {

    @Autowired
    UserRepository repo;

    public User saveUser(User user) {
        // TODO hash/salt handling
        return repo.save(user);
    }


    public List<User> getAll() {
        return repo.findAll();
    }

    public Boolean deleteUser(Long id) {
        Boolean userExists = repo.findOne(id) != null;
        if (userExists) {
            repo.delete(id);
        }
        return userExists;
    }

    public boolean isAuthorizedForLogin(LoginAttemptDTO loginAttempt) {
        return repo.isAuthorizedForLogin(loginAttempt);
    }

}
