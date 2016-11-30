package se.secure.foliechatt.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import se.secure.foliechatt.encryption.PublicKey;

import java.util.*;

public class ChatRoom {

    private static final int CHATROOM_ID_LENGTH = 10;
    //TODO MAKE GUEST LIST
    private String id;
    private String name;
    @JsonIgnore
    private Map<PublicKey, User> roomUsers;
    private List<User> allowedUsers;

    public ChatRoom(User initialUser, PublicKey publicKey) {
        roomUsers = new HashMap<PublicKey, User>();
        allowedUsers = new ArrayList<>();              // invitelist

        this.id = getUniqueChatId();
        allowedUsers.add(initialUser);
        addUser(publicKey, initialUser);
    }

    public boolean addUserIfNotPresent(PublicKey publicKey) {

        Boolean u = roomUsers.containsKey(publicKey.getValue());

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

    private void inviteUser(User user) {
        allowedUsers.add(user);
    }

    private String getUniqueChatId() {
        Random randomService = new Random();
        StringBuilder sb = new StringBuilder();
        while (sb.length() < CHATROOM_ID_LENGTH) {
            sb.append(Integer.toHexString(randomService.nextInt()));
        }
        return sb.toString();
    }

    public List<Chatter> getUsers(){
        List<Chatter> users = new ArrayList<>();
        for (Map.Entry<PublicKey, User> entry  : roomUsers.entrySet()) {
            users.add(new Chatter(entry.getKey(), entry.getValue()));
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
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
