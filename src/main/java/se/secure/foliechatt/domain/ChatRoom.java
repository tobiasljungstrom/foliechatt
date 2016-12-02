package se.secure.foliechatt.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import se.secure.foliechatt.security.encryption.PublicKey;

import java.util.*;

public class ChatRoom {

    private static final int CHATROOM_ID_LENGTH = 10;

    private String id;
    private String name;
    @JsonIgnore
    private List<Chatter> chatters;
    @JsonIgnore
    private List<User> allowedUsers;

    public ChatRoom(User initialUser, String publicKey) {
        this.id = generateUniqueChatRoomId();
        chatters = new ArrayList<>();
        allowedUsers = new ArrayList<>();

        allowedUsers.add(initialUser);
        Chatter initialChatter = new Chatter(initialUser, publicKey);
        chatters.add(initialChatter);
    }

    private String generateUniqueChatRoomId() {
        Random randomService = new Random();
        StringBuilder sb = new StringBuilder();
        while (sb.length() < CHATROOM_ID_LENGTH) {
            sb.append(Integer.toHexString(randomService.nextInt()));
        }
        return sb.toString();
    }

    private void inviteUser(User user) {
        allowedUsers.add(user);
    }

    public Boolean isUserInChatRoom(User user) {
        int index = indexOfUserInChatters(user);
        return index > -1;
    }

    private int indexOfPublicKeyInChatters(String publicKey) {
        for (Chatter chatter: chatters) {
            if (chatter.getPublicKey().equals(publicKey)){
                return chatters.indexOf(chatter);
            }
        }
        return -1;
    }

    private int indexOfUserInChatters(User user) {
        for (Chatter chatter: chatters) {
            if (chatter.getUser().toString().equals(user.toString())){
                return chatters.indexOf(chatter);
            }
        }
        return -1;
    }

    public void addChatter(User user, String publicKey) {
        if (indexOfPublicKeyInChatters(publicKey) > -1) {
            chatters.set(indexOfPublicKeyInChatters(publicKey), new Chatter(user, publicKey));
        }
        chatters.add(new Chatter(user, publicKey));
    }

    public List<Chatter> getUsers() {
        return chatters;
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

}
