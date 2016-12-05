package se.secure.foliechatt.resources.restful;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.domain.*;
import se.secure.foliechatt.exceptions.InvalidLoginException;
import se.secure.foliechatt.services.UserService;

import javax.persistence.NoResultException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;


@RestController
@RequestMapping(value = "/api/v.1")
public class LoginController {

    @Autowired
    private UserService userService;

    @CrossOrigin
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity login(@RequestBody LoginAttempt loginAttempt) {

        User user;
        try {
            user = userService.authenticateUser(loginAttempt);
        } catch (InvalidLoginException | NoResultException e) {
            return ResponseEntity.status(401).body("Wrong username/password");
        }

        LoggedInUser loggedInUser = userService.addUserAsLoggedIn(user);

        LoginResponse loginResponse = new LoginResponse(loggedInUser.getUser(), loggedInUser.getSessionToken());

        return ResponseEntity.status(HttpStatus.OK).body(loginResponse);
    }

    @CrossOrigin
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public ResponseEntity logout(@RequestHeader(name="sessionToken", required = true) String sessionToken){
        User user = UserManager.getUserBySessionToken(sessionToken);
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to log out");
        }
        if (UserManager.removeLoggedInUser(user)){
            return ResponseEntity.ok().body("user logged out");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout failed!");
    }
}
