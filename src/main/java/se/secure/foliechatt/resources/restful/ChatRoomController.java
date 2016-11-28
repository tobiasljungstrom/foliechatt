package se.secure.foliechatt.resources.restful;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.domain.Chatter;
import se.secure.foliechatt.services.ChatRoomService;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v.1/chatroom")
public class ChatRoomController {

    @Autowired
    ChatRoomService chatRoomService;

    @RequestMapping(value = "/{roomId}", method = RequestMethod.POST)
    public List<Chatter> joinChatRoom(@PathVariable Long roomId, @RequestBody User user) {

        List<Chatter> users =  chatRoomService.addUserToRoom(user, roomId);

        return users;
    }
}
