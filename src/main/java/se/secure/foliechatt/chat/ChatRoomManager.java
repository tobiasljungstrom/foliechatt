package se.secure.foliechatt.chat;

import se.secure.foliechatt.domain.ChatRoom;
import se.secure.foliechatt.domain.User;
import se.secure.foliechatt.encryption.PublicKey;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ChatRoomManager {
    private static ChatRoomManager instance = null;
    private static List<ChatRoom> chatRooms;

    public ChatRoomManager() {

        if (chatRooms == null) {
            chatRooms = new ArrayList<>();
        }

    }

    public static ChatRoomManager getInstance() {
        if(instance == null) {
            instance = new ChatRoomManager();
        }
        return instance;
    }

    public static void addChatRoom(ChatRoom chatRoom) {
        chatRooms.add(chatRoom);
    }

    public static Optional<ChatRoom> getChatRoomById(String id) {
        System.out.println("getting chatroom with id " + id);
        return chatRooms.stream()
                .filter(chatRoom -> chatRoom.getId().equals(id))
                .findFirst();
    }
}
