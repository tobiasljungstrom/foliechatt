package se.secure.foliechatt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import se.secure.foliechatt.chat.ChatRoomManager;
import se.secure.foliechatt.domain.*;
import se.secure.foliechatt.encryption.PublicKey;

import java.util.*;

@Service
public class ChatRoomService {

    private static final int CHATROOM_ID_LENGTH = 10;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    public List<Chatter> addUserToRoom(PublicKey publicKey, User user, String roomId) {
        Optional<ChatRoom> chatRoom = ChatRoomManager.getInstance().getChatRoomById(roomId);
        List<Chatter> usersInRoom = new ArrayList<>();
        if(chatRoom.isPresent()){
            chatRoom.get().addUser(publicKey, user);
            usersInRoom = chatRoom.get().getUsers();
            //TODO: Use the resource instead of directly calling template
            simpMessagingTemplate.convertAndSend("/topic/greetings/" + roomId + "/status", usersInRoom);
        }
        return usersInRoom;

    }

}
