package se.secure.foliechatt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.secure.foliechatt.domain.LoginAttempt;
import se.secure.foliechatt.domain.Password;
import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.encryption.Hasher;
import se.secure.foliechatt.exceptions.InvalidLoginException;
import se.secure.foliechatt.persistence.UserRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@SuppressWarnings("JpaQueryApiInspection")
@Service
public class UserService {

    @Autowired
    UserRepository repo;
    @PersistenceContext
    EntityManager em;
    private static Map<User, String> loggedInUsers = new HashMap<>();

    public void addUserAsLoggedIn(User user, String sessionToken) {
        loggedInUsers.put(user, sessionToken);
    }

    public boolean userIsLoggedIn(User user) {
        return loggedInUsers.get(user) != null;
    }

    public boolean isValidSessionToken(String sessionToken) {
        return loggedInUsers.containsValue(sessionToken);
    }

    public boolean isValidSessionKeyForUser(User user, String sessionToken) {
        String expectedSessionToken = loggedInUsers.get(user);
        return sessionToken.equals(expectedSessionToken);
    }

    public Optional<User> getUserBySessionToken(String sessionToken) {
        return loggedInUsers.entrySet().stream()
                .filter( entry -> entry.getValue().equals(sessionToken))
                .map(entry -> entry.getKey())
                .findAny();
    }

    public String getUniqueSessionToken(User user) {
        String sessionToken = null;
        try {
            sessionToken = Hasher.GenerateHash(user.toString() + Math.random()).getHash();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return sessionToken;
    }



    public User saveUser(User user) throws NoSuchAlgorithmException, InvalidKeySpecException {

        Hasher hasher = new Hasher();
        Password password = hasher.GenerateHash(user.getPassword());

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

    public User authenticateUser(LoginAttempt loginAttempt) throws InvalidLoginException {
        TypedQuery<User> query = em.createNamedQuery("User.findByEmail", User.class);
        query.setParameter("email", loginAttempt.getEmail());
        User result = query.getSingleResult();

        if(result == null){
            throw new InvalidLoginException("User not found");
        }

        //TODO: Use hash validation instead
        if(result.getPassword().equals(loginAttempt.getPassword())){
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
