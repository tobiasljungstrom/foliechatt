package se.secure.foliechatt.domain;

import java.util.HashMap;
import java.util.Map;

public class ChatRoom {

    //TODO MAKE GUEST LIST
    private Map<Key, User> roomUsers;

    public ChatRoom() {
        roomUsers = new HashMap<Key, User>();
    }

    public User put(Key key, User value) {
        return roomUsers.put(key, value);
    }

    public User remove(Object key) {
        return roomUsers.remove(key);
    }
}
