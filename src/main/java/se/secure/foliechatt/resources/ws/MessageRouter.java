package se.secure.foliechatt.resources.ws;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import se.secure.foliechatt.domain.ChatRoom;
import se.secure.foliechatt.chat.ChatRoomManager;
import se.secure.foliechatt.domain.Message;
import se.secure.foliechatt.services.ChatRoomService;

import java.util.Optional;

@Controller
public class MessageRouter {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ChatRoomService chatRoomService;

    @MessageMapping("/hello/{roomID}")
    public void greeting(@DestinationVariable String roomID, Message message) {
        System.out.println("inside greeting method!");
        System.out.println("message has sender: " + message.getSender().getValue());
        System.out.println("message has receiver: " + message.getReceiver().getValue());
        message.setContent(message.getContent());

        ChatRoom chatRoom = ChatRoomManager.getChatRoomById(roomID);
        if (chatRoom == null){
            throw new RuntimeException("Tried to send message chat room that doesn't exist");
        }

        System.out.println("forwarding message to " + message.getReceiver().getValue());
        simpMessagingTemplate.convertAndSend("/topic/greetings/" + roomID + "/" + message.getReceiver().getValue(), message);
    }
}