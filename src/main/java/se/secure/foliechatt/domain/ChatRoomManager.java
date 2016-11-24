package se.secure.foliechatt.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ChatRoomManager {
    private List<ChatRoom> chatRooms;

    public ChatRoomManager() {
        chatRooms = new ArrayList<>();

        ChatRoom r1 = new ChatRoom(new Long(500));
        r1.addUser(new PublicKey("Erik"), new User("Erik"));
        r1.addUser(new PublicKey("Henrik"), new User("Henrik"));

        ChatRoom r2 = new ChatRoom(new Long(555));
        r2.addUser(new PublicKey("Olle"), new User("Olle"));
        r2.addUser(new PublicKey("Pelle"), new User("Pelle"));

        chatRooms.add(r1);
        chatRooms.add(r2);
    }

    public Optional<ChatRoom> getChatRoomById(Long id) {
        System.out.println("getting chatroom with id " + id);
        return chatRooms.stream()
                .filter(chatRoom -> chatRoom.getId().equals(id))
                .findFirst();
    }
}
