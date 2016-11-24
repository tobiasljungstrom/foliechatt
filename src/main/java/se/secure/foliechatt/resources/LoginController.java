package se.secure.foliechatt.resources;

import org.omg.CORBA.Object;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.domain.LoginAttemptDTO;
import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.services.UserService;

@RestController
@RequestMapping(value = "/api/v.1/login")
public class LoginController {

    @Autowired
    private UserService userService;

    @CrossOrigin
    @RequestMapping(method = RequestMethod.POST)
    ResponseEntity<User> login(@RequestBody LoginAttemptDTO loginAttempt) {

        if(! userService.isAuthorizedForLogin(loginAttempt)) {
            //TODO: figure out how to best represent a successful login.
            // JSON-Token is one way to go, something stored in the header of
            // all future requests to the rest API.
            // if so: how to generate and validate a token?
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new User() {
            });
        }

        return ResponseEntity.status(HttpStatus.OK).body(new User());

    }
}
