package se.secure.foliechatt.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ChatRoom {

    //TODO MAKE GUEST LIST
    private Long id;
    private String name;
    private Map<PublicKey, User> roomUsers;

    public ChatRoom() {
        this(null);
    }
    // testing
    public ChatRoom(Long id) {
        this.id = id;
        roomUsers = new HashMap<PublicKey, User>();
    }

    public boolean addUserIfNotPresent(PublicKey publicKey) {
        //boolean doesNotExists = !roomUsers.containsKey(publicKey);

        Boolean u = roomUsers.containsKey(publicKey.getValue());

        // roomUsers.containsKey(publicKey);

        boolean doesNotExists =  roomUsers.keySet().stream()
                .filter(k -> k.getValue().equals(publicKey.getValue()))
                .count() == 0l;
        if(doesNotExists) {
            System.out.println("adding user with publicKey " + publicKey.getValue() + " to chatroom with id " + id);
            addUser(publicKey, new User("Bob"));
            return true;
        } else {
            // nothing added, did exist
            return false;
        }

    }

    public List<UserWrapper> getUsers(){
        List<UserWrapper> users = new ArrayList<>();
        for (Map.Entry<PublicKey, User> entry  : roomUsers.entrySet()) {
            users.add(new UserWrapper(entry.getKey(), entry.getValue()));
        }
        return users;
    }

    public User addUser(PublicKey publicKey, User value) {
        roomUsers.put(publicKey, value);
        return roomUsers.put(publicKey, value);
    }

    public User remove(Object key) {
        return roomUsers.remove(key);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<PublicKey, User> getRoomUsers() {
        return roomUsers;
    }

    public void setRoomUsers(Map<PublicKey, User> roomUsers) {
        this.roomUsers = roomUsers;
    }
}
