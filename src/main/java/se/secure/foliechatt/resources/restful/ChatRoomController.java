package se.secure.foliechatt.resources.restful;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.secure.foliechatt.chat.ChatRoomManager;
import se.secure.foliechatt.domain.ChatRoom;

import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.domain.UserManager;
import se.secure.foliechatt.services.ChatRoomService;
import se.secure.foliechatt.services.UserService;


import static se.secure.foliechatt.chat.ChatRoomManager.chatRoomExist;
import static se.secure.foliechatt.chat.ChatRoomManager.getChatRoomById;


@RestController
@CrossOrigin
@RequestMapping(value = "/api/v.1/chatroom")
public class ChatRoomController {

    @Autowired
    ChatRoomService chatRoomService;
    @Autowired
    UserService userService;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity createChatRoom(@RequestHeader(name = "sessionToken", required = true) String sessionToken , @RequestBody String publicKey) {
        User user = UserManager.getUserBySessionToken(sessionToken);
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        ChatRoom chatRoom = new ChatRoom(user, publicKey);

//        int i = 0;
//        while (chatRoomExist(chatRoom.getId())) {
//            i++;
//            chatRoom = new ChatRoom(user, publicKey);
//            if (i > 2) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//            }
//        }
        ChatRoomManager.addChatRoom(chatRoom);

        return ResponseEntity.ok(chatRoom);
    }


    @RequestMapping(value = "/{roomId}", method = RequestMethod.POST)
    public ResponseEntity joinChatRoom(@RequestHeader(name="sessionToken", required = true) String sessionToken, @PathVariable String roomId, @RequestBody String publicKey) {
        User user = UserManager.getUserBySessionToken(sessionToken);
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ChatRoom chatRoom = ChatRoomManager.getChatRoomById(roomId);

        if(chatRoom == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        chatRoomService.newChatterInRoom(user, publicKey, roomId);
        return ResponseEntity.ok(chatRoom);
    }
}
