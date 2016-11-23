package se.secure.foliechatt.domain;

public class Message {

    private Key sender;

    private Key receiver;

    private String content;

    public Message() {
    }

    public Key getSender() {
        return sender;
    }

    public void setSender(Key sender) {
        this.sender = sender;
    }


    public Key getReceiver() {
        return receiver;
    }

    public void setReceiver(Key receiver) {
        this.receiver = receiver;
    }

    public Message(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

}
