package se.secure.foliechatt.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import se.secure.foliechatt.chat.ChatRoomManager;
import se.secure.foliechatt.domain.*;

import java.util.*;


@Service
public class ChatRoomService {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public List<Chatter> newChatterInRoom(String roomId) {
        ChatRoom chatRoom = ChatRoomManager.getChatRoomById(roomId);
        List<Chatter> chatters = chatRoom.getUsers();
        //TODO: Use the resource instead of directly calling template
        simpMessagingTemplate.convertAndSend("/topic/greetings/" + roomId + "/status", chatters);
        return chatters;
    }

    public List<Chatter> oldChatterInRoom(String roomId, User user) {
        ChatRoom chatRoom = ChatRoomManager.getChatRoomById(roomId);
        List<Chatter> chatters = chatRoom.getUsers();
        simpMessagingTemplate.convertAndSend("/topic/greetings/" + roomId + "/" + user.getAlias(), chatters);
        return chatters;
    }

    public void leaveChatroom(User user, String roomId) {
        ChatRoom chatRoom = ChatRoomManager.getChatRoomById(roomId);
        chatRoom.removeChatter(user);
        List<Chatter> chatters = chatRoom.getUsers();
        simpMessagingTemplate.convertAndSend("/topic/greetings/" + roomId + "/status", chatters);

    }

}
