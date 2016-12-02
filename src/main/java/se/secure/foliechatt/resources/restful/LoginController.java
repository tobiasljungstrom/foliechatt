package se.secure.foliechatt.resources.restful;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.domain.*;
import se.secure.foliechatt.exceptions.InvalidLoginException;
import se.secure.foliechatt.services.UserService;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;


@RestController
@RequestMapping(value = "/api/v.1/login")
public class LoginController {

    @Autowired
    private UserService userService;

    @CrossOrigin
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity login(@RequestBody LoginAttempt loginAttempt) throws InvalidKeySpecException, NoSuchAlgorithmException {

        User user;
        try {
            user = userService.authenticateUser(loginAttempt);
        } catch (InvalidLoginException e) {
            return ResponseEntity.status(401).body("Wrong username/password");
        }

        LoggedInUser loggedInUser = userService.addUserAsLoggedIn(user);

        LoginResponse loginResponse = new LoginResponse(loggedInUser.getUser(), loggedInUser.getSessionToken());

        return ResponseEntity.status(HttpStatus.OK).body(loginResponse);
    }

//    @CrossOrigin
//    @RequestMapping(method = RequestMethod.POST)
//    public ResponseEntity logout(@RequestHeader(name="sessionToken", required = true) String sessionToken) throws InvalidKeySpecException, NoSuchAlgorithmException {
//
//
//
//        User user ;
//
//        try {
//        } catch (InvalidLoginException e) {
//            return ResponseEntity.status(401).body("Wrong username/password");
//        }
//
//        String sessionToken = userService.getUniqueSessionToken(user);
//        userService.addUserAsLoggedIn(user, sessionToken);
//
//        return ResponseEntity.status(HttpStatus.OK).body(new LoginResponse(user, sessionToken));
//    }
}
