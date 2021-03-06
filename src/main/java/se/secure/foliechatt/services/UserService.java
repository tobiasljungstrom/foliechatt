package se.secure.foliechatt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.secure.foliechatt.domain.*;
import se.secure.foliechatt.security.hashing.Hasher;
import se.secure.foliechatt.exceptions.InvalidLoginException;
import se.secure.foliechatt.persistence.UserRepository;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;

import static se.secure.foliechatt.domain.UserManager.*;


@SuppressWarnings("JpaQueryApiInspection")
@Service
public class UserService {

    @Autowired
    UserRepository repo;
    @PersistenceContext
    EntityManager em;


    public LoggedInUser addUserAsLoggedIn(User user) {
        LoggedInUser loggedInUser = new LoggedInUser(user);
        int userIndex = indexOfUserInLoggedInUser(user);
        if (userIndex > -1){
            setLoggedInUser(userIndex, loggedInUser);
            return loggedInUser;
        }
        addLoggedInUser(loggedInUser);
        return loggedInUser;
    }

    public User saveUser(User user) {
        Password password = null;
        try {
            password = Hasher.GenerateHash(user.getPassword());
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            e.printStackTrace();
        }
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

    public User authenticateUser(LoginAttempt loginAttempt) throws NoResultException, InvalidLoginException {
        TypedQuery<User> query = em.createNamedQuery("User.findByEmail", User.class);
        query.setParameter("email", loginAttempt.getEmail());
        User result = query.getSingleResult();
        boolean passwordIsValid = false;
        try {
            passwordIsValid = Hasher.validateHash(loginAttempt.getPassword(), result.getPassword(), result.getSalt(), result.getIterations());
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            e.printStackTrace();
        }
        if(passwordIsValid){
            return result;
        }
        throw new InvalidLoginException("Wrong password");
    }

    public boolean userWithAliasExists(User user) throws NoResultException {
        try {
            TypedQuery<User> query = em.createNamedQuery("User.findByAlias", User.class);
            query.setParameter("alias", user.getAlias());
            User result = query.getSingleResult();
        }   catch (NoResultException e){
            return false;
        }
        return true;
    }

    public boolean userWithEmailExists(User user) throws NoResultException {
        try {
            TypedQuery<User> query = em.createNamedQuery("User.findByEmail", User.class);
            query.setParameter("email", user.getEmail());
            User result = query.getSingleResult();
        }   catch (NoResultException e){
            return false;
        }
        return true;
    }

    public boolean isAuthorizedForLogin(LoginAttempt loginAttempt) {
        TypedQuery<User> query = em.createNamedQuery("User.findByEmail", User.class);
        query.setParameter("email", loginAttempt.getEmail());
        List<User> result = query.getResultList();

        // edge cases
        if(result.isEmpty()) {
            return false;
        } else if(result.size() > 1) {
            throw new RuntimeException("multiple users with the same email!");
        }

        // actual password check
        return result.get(0).getPassword().equals(loginAttempt.getPassword());
    }

}
