package se.secure.foliechatt.resources;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.services.UserService;
import java.util.List;

@RestController
@RequestMapping(value = "/api/v.1/users")
public class UserController {

    @Autowired
    private UserService userService;

    /*
     * @CrossOrigin allows the webpack dev server to access the methods from a different port than the server.
     * Should be removed for release.
     */

    @CrossOrigin
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @CrossOrigin
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @CrossOrigin
    @RequestMapping(method = RequestMethod.DELETE, value = "/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long id) {
        Boolean success = userService.deleteUser(id);
        HttpStatus status = success ? HttpStatus.GONE : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(new User());
    }
}
