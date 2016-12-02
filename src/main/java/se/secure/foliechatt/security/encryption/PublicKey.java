package se.secure.foliechatt.security.encryption;

public class PublicKey {

    private String value;

    public PublicKey() {}

    public PublicKey(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
