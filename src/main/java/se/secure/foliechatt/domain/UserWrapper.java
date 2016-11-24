package se.secure.foliechatt.domain;

public class UserWrapper {

    private String userAlias;
    private String publicKey;

    public UserWrapper(PublicKey key, User user) {
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
