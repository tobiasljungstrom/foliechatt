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

    private ChatRoomManager chatRoomManager;

    public ChatRoomService() {
        this.chatRoomManager = new ChatRoomManager();
    }

    public List<Chatter> addUserToRoom(User user, Long roomId) {
        Optional<ChatRoom> chatRoom = chatRoomManager.getChatRoomById(roomId);
        List<Chatter> usersInRoom = new ArrayList<>();
        if(chatRoom.isPresent()){
            chatRoom.get().addUser(new PublicKey(String.valueOf(Math.random())), user);
            usersInRoom = chatRoom.get().getUsers();
            //TODO: Use the resource instead of directly calling template
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
