package se.secure.foliechatt.domain;

public class Key {

    private String value;

    public Key() {}

    public Key(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
