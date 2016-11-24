package se.secure.foliechatt.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import se.secure.foliechatt.services.ChatRoomService;

import java.util.Optional;

@Controller
public class MessageRouter {

    //@MessageMapping("/hello/{chatroomID}/{receiverPublicKey}")
    // @SendTo("/topic/greetings/{chatroomID}/{receiverPublicKey}")

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ChatRoomService chatRoomService;

    private ChatRoomManager chatRoomManager;



    @MessageMapping("/hello/{roomID}")
    public void greeting(@DestinationVariable Long roomID, Message message) throws Exception {
        chatRoomManager = chatRoomService.getChatRoomManager();
        System.out.println("inside greeting method!");
        System.out.println("message has sender: " + message.getSender().getValue());
        System.out.println("message has receiver: " + message.getReceiver().getValue());
        message.setContent(message.getContent());

        Optional<ChatRoom> maybeChatRoom = chatRoomManager.getChatRoomById(roomID);
        ChatRoom chatRoom = maybeChatRoom.orElseThrow( () -> new RuntimeException("Tried to send message chat room that doesn't exist"));
        boolean wasAdded = chatRoom.addUserIfNotPresent(message.getSender());

        if(wasAdded) {
            System.out.println("returning updated list of users to /status");
            simpMessagingTemplate.convertAndSend("/topic/greetings/" + roomID + "/status", chatRoom.getUsers() );
        }

        System.out.println("forwarding message to " + message.getReceiver().getValue());
        simpMessagingTemplate.convertAndSend("/topic/greetings/" + roomID + "/" + message.getReceiver().getValue(), message);
        // return message;
    }










}