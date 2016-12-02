package se.secure.foliechatt.chat;

import se.secure.foliechatt.domain.ChatRoom;

import java.util.ArrayList;
import java.util.List;


public final class ChatRoomManager {
//    private static ChatRoomManager instance = null;
    private static List<ChatRoom> chatRooms = new ArrayList<>();

    private ChatRoomManager() {

        if (chatRooms == null) {
            chatRooms = new ArrayList<>();
        }

    }

//    public static ChatRoomManager getInstance() {
//        if(instance == null) {
//            instance = new ChatRoomManager();
//        }
//        return instance;
//    }

    public static void addChatRoom(ChatRoom chatRoom) {
        chatRooms.add(chatRoom);
    }

    public static Boolean chatRoomExist (String id){
        return getChatRoomById(id) != null;
    }

    public static ChatRoom getChatRoomById(String id) {
        System.out.println("getting chatroom with id " + id);
        for (ChatRoom chatRoom: chatRooms) {
            if (chatRoom.getId().equals(id)){
                return chatRoom;
            }
        }
        return null;
    }
}
