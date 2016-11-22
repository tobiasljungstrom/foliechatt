package se.secure.foliechatt.domain;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageRouter {


    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Message greeting(Message message) throws Exception {
        System.out.println("inside greeting method!");
        return new Message("Hello, " + message.getContent() + "!");
    }

}