package se.secure.foliechatt.domain;

public class LoginResponse {
    private String sessionToken;
    private User user;

    public LoginResponse(User user, String sessionToken) {
        this.user = user;
        this.sessionToken = sessionToken;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
