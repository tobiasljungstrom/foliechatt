package se.secure.foliechatt.domain;

public class Message {

    private Key sender;

    private Key reciever;

    private String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
