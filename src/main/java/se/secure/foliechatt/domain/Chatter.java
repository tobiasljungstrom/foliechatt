package se.secure.foliechatt.domain;

import se.secure.foliechatt.security.encryption.PublicKey;

public class Chatter {

    private User user;
    private String userAlias;
    private String publicKey;

    public Chatter(User user, String publicKey) {
        this.user = user;
        this.userAlias = user.getAlias();
        this.publicKey = publicKey;
    }

    public String getUserAlias() {
        return userAlias;
    }

    public User getUser() {
        return user;
    }

    public String getPublicKey() {
        return publicKey;
    }
}
