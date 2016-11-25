package se.secure.foliechatt.resources;

import org.omg.CORBA.Object;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.domain.LoginAttemptDTO;
import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.exceptions.InvalidLoginException;
import se.secure.foliechatt.services.UserService;

import javax.xml.ws.Response;

@RestController
@RequestMapping(value = "/api/v.1/login")
public class LoginController {

    @Autowired
    private UserService userService;

    @CrossOrigin
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity login(@RequestBody LoginAttemptDTO loginAttempt) {

        User user;
        try {
            user = userService.authenticateUser(loginAttempt);
        } catch (InvalidLoginException e) {
            return ResponseEntity.status(401).body("Wrong username/password");
        }

        return ResponseEntity.status(HttpStatus.OK).body(user);

    }
}
