package se.secure.foliechatt.resources.restful;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.domain.LoginAttempt;
import se.secure.foliechatt.domain.LoginResponse;
import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.exceptions.InvalidLoginException;
import se.secure.foliechatt.services.UserService;

import javax.persistence.NoResultException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;


@RestController
@RequestMapping(value = "/api/v.1/login")
public class LoginController {

    @Autowired
    private UserService userService;

    @CrossOrigin
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity login(@RequestBody LoginAttempt loginAttempt) {

        User user;
        try {
            user = userService.authenticateUser(loginAttempt);
        } catch (InvalidLoginException | NoResultException e) {
            return ResponseEntity.status(401).body("Wrong username/password");
        }

        String sessionToken = userService.getUniqueSessionToken(user);
        userService.addUserAsLoggedIn(user, sessionToken);

        return ResponseEntity.status(HttpStatus.OK).body(new LoginResponse(user, sessionToken));
    }
}
