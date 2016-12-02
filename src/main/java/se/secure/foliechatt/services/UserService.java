package se.secure.foliechatt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.secure.foliechatt.domain.*;
import se.secure.foliechatt.security.hashing.Hasher;
import se.secure.foliechatt.exceptions.InvalidLoginException;
import se.secure.foliechatt.persistence.UserRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;

import static se.secure.foliechatt.domain.UserManager.*;
import static se.secure.foliechatt.security.hashing.Hasher.GenerateHash;


@SuppressWarnings("JpaQueryApiInspection")
@Service
public class UserService {

    @Autowired
    UserRepository repo;
    @PersistenceContext
    EntityManager em;


    public LoggedInUser addUserAsLoggedIn(User user) {
        LoggedInUser loggedInUser = new LoggedInUser(user);
        int userIndex = indexOfLoggedInUser(user);
        if (userIndex > -1){
            setLoggedInUser(userIndex, loggedInUser);
            return loggedInUser;
        }
        addLoggedInUser(loggedInUser);
        return loggedInUser;
    }

    public User saveUser(User user) throws NoSuchAlgorithmException, InvalidKeySpecException {

        Hasher hasher = new Hasher();
        Password password = GenerateHash(user.getPassword());

        user.setFullPassword(password);

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

    public User authenticateUser(LoginAttempt loginAttempt) throws InvalidLoginException, InvalidKeySpecException, NoSuchAlgorithmException {
        TypedQuery<User> query = em.createNamedQuery("User.findByEmail", User.class);
        query.setParameter("email", loginAttempt.getEmail());
        User result = query.getSingleResult();

        if(result == null){
            throw new InvalidLoginException("User not found");
        }

        //TODO: Use hash validation instead
        if(Hasher.validateHash(loginAttempt.getPassword(), result.getPassword(), result.getSalt(), result.getIterations())){
            return result;
        }

        throw new InvalidLoginException("Wrong password");

    }

    public boolean isAuthorizedForLogin(LoginAttempt loginAttempt) {
        TypedQuery<User> query = em.createNamedQuery("User.findByEmail", User.class);
        query.setParameter("email", loginAttempt.getEmail());
        List<User> result = query.getResultList();

        System.out.println("result size is: " + result.size());
        // edge cases
        if(result.isEmpty()) {
            return false;
        } else if(result.size() > 1) {
            throw new RuntimeException("multiple users with the same email!");
        }

        // actual password check
        System.out.println("result pass = " + result.get(0).getPassword());
        System.out.println("try pass = " + loginAttempt.getPassword());
        return result.get(0).getPassword().equals(loginAttempt.getPassword());
    }

}
