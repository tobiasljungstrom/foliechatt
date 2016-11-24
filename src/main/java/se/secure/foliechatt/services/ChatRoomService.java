package se.secure.foliechatt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import se.secure.foliechatt.domain.*;

import java.util.*;

@Service
public class ChatRoomService {

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    private ChatRoomManager chatRoomManager;

    public ChatRoomService() {
        this.chatRoomManager = new ChatRoomManager();
    }

    public List<UserWrapper> addUserToRoom(User user, Long roomId) {
        Optional<ChatRoom> chatRoom = chatRoomManager.getChatRoomById(roomId);
        List<UserWrapper> usersInRoom = new ArrayList<>();
        if(chatRoom.isPresent()){
            chatRoom.get().addUser(new PublicKey(String.valueOf(Math.random())), user);
            usersInRoom = chatRoom.get().getUsers();
            simpMessagingTemplate.convertAndSend("/topic/greetings/" + roomId + "/status", usersInRoom);
        }
        return usersInRoom;

    }

    public ChatRoomManager getChatRoomManager() {
        return chatRoomManager;
    }

    public void setChatRoomManager(ChatRoomManager chatRoomManager) {
        this.chatRoomManager = chatRoomManager;
    }
}
