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
    SimpMessagingTemplate simpMessagingTemplate;

    public List<Chatter> newChatterInRoom(User user, String publicKey, String roomId) {

        ChatRoom chatRoom = ChatRoomManager.getChatRoomById(roomId);
        chatRoom.addChatter(user, publicKey);
        List<Chatter> chatters = chatRoom.getUsers();

        //TODO: Use the resource instead of directly calling template
        simpMessagingTemplate.convertAndSend("/topic/greetings/" + roomId + "/status", chatters);

        return chatters;

    }

}
