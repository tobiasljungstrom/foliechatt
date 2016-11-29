package se.secure.foliechatt.resources.restful;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.domain.ChatRoom;
import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.domain.Chatter;
import se.secure.foliechatt.encryption.PublicKey;
import se.secure.foliechatt.services.ChatRoomService;
import se.secure.foliechatt.services.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/v.1/chatroom")
public class ChatRoomController {

    @Autowired
    ChatRoomService chatRoomService;
    @Autowired
    UserService userService;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity createChatRoom(@RequestHeader(name = "sessionToken", required = true) String sessionToken ,@RequestBody String publicKey) {

        Optional<User> maybeUser = userService.getUserBySessionToken(sessionToken);

        if(! maybeUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = maybeUser.get();

        // TODO GET PUBLIC KEY FROM FRONEND!
        ChatRoom chatRoom = new ChatRoom(user, new PublicKey(publicKey));

        //TODO REMOVE
        for (int i = 0; i < chatRoom.getUsers().size(); i++ ){
            System.out.println(chatRoom.getUsers().get(i).getUserAlias());
        }


        return ResponseEntity.ok(chatRoom.getUsers());
    }


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
