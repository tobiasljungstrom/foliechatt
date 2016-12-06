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


@RestController
@CrossOrigin
@RequestMapping(value = "/api/v.1/chatroom")
public class ChatRoomController {

    @Autowired
    ChatRoomService chatRoomService;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity createChatRoom(@RequestHeader(name = "sessionToken", required = true) String sessionToken , @RequestBody String publicKey) {
        User user = UserManager.getUserBySessionToken(sessionToken);
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to create a chat room");
        }
        ChatRoom chatRoom = new ChatRoom(user, publicKey);
        ChatRoomManager.addChatRoom(chatRoom);
        return ResponseEntity.ok(chatRoom);
    }


    @RequestMapping(value = "/join/{roomId}", method = RequestMethod.PUT)
    public ResponseEntity joinChatRoom(@RequestHeader(name="sessionToken", required = true) String sessionToken, @PathVariable String roomId, @RequestBody String publicKey) {
        User user = UserManager.getUserBySessionToken(sessionToken);
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to join a chat room");
        }
        ChatRoom chatRoom = ChatRoomManager.getChatRoomById(roomId);

        if(chatRoom == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The requested chat room <" + roomId + "> does not exist");
        } else if (chatRoom.isUserInChatRoom(user)){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The user is already in chat room: " + roomId);
        } else {
            chatRoom.addChatter(user, publicKey);
            chatRoomService.newChatterInRoom(roomId);
            return ResponseEntity.ok(chatRoom);
        }
    }

    @RequestMapping(value = "/{roomId}/leave", method = RequestMethod.POST)
    public ResponseEntity leaveChatRoom(@RequestHeader(name="sessionToken", required = true) String sessionToken, @PathVariable String roomId) {
        User user = UserManager.getUserBySessionToken(sessionToken);
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to leave a chat room");
        }
        ChatRoom chatRoom = ChatRoomManager.getChatRoomById(roomId);

        if(chatRoom == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The requested chat room <" + roomId + "> does not exist");
        }

        chatRoomService.leaveChatroom(user, roomId);
        return ResponseEntity.ok(chatRoom);
    }

}
