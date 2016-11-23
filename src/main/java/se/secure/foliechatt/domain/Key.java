package se.secure.foliechatt.domain;

public class Key {


    public Key() {}
    public Key(String value) {
        this.value = value;
    }

    private String value;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
