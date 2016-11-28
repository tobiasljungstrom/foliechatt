package se.secure.foliechatt.domain;

import se.secure.foliechatt.encryption.PublicKey;

public class Chatter {

    private String userAlias;
    private String publicKey;

    public Chatter(PublicKey key, User user) {
        this.userAlias = user.getAlias();
        this.publicKey = key.getValue();
    }

    public String getUserAlias() {
        return userAlias;
    }

    public String getPublicKey() {
        return publicKey;
    }
}
