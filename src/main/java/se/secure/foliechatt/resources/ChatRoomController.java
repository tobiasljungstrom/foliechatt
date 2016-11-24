package se.secure.foliechatt.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.domain.ChatRoom;
import se.secure.foliechatt.domain.PublicKey;
import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.services.ChatRoomService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v.1/chatroom")
public class ChatRoomController {

    @Autowired
    ChatRoomService chatRoomService;

    @RequestMapping(value = "/{roomId}", method = RequestMethod.POST)
    public Map<PublicKey, User> joinChatRoom(@PathVariable Long roomId, @RequestBody User user) {

        Map<PublicKey,User> users =  chatRoomService.addUserToRoom(user, roomId);

        return users;
    }

}
