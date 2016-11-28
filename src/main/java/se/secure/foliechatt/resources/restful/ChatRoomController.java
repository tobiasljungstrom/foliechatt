package se.secure.foliechatt.resources.restful;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.domain.Chatter;
import se.secure.foliechatt.services.ChatRoomService;
import se.secure.foliechatt.services.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v.1/chatroom")
public class ChatRoomController {

    @Autowired
    ChatRoomService chatRoomService;
    @Autowired
    UserService userService;

    @RequestMapping(value = "/{roomId}", method = RequestMethod.POST)
    public ResponseEntity joinChatRoom(@PathVariable Long roomId, @RequestBody String sessionToken) {

        Optional<User> maybeUser = userService.getUserBySessionToken(sessionToken);

        if(! maybeUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Chatter> users =  chatRoomService.addUserToRoom(maybeUser.get(), roomId);

        return ResponseEntity.ok(users);
    }
}
