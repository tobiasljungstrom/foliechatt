package se.secure.foliechatt.domain;


import se.secure.foliechatt.security.hashing.Hasher;

public class LoggedInUser {
    private User user;
    private String sessionToken;

    private LoggedInUser(LoggedInUser loggedInUser){

    }

    public LoggedInUser(User user) {
        this.user = user;
        this.sessionToken = getUniqueSessionToken(user);

    }

    public LoggedInUser(User user, String sessionToken){
        this.user = user;
        this.sessionToken = sessionToken;
    }

    private String getUniqueSessionToken(User user) {
        String sessionToken = null;
        try {
            sessionToken = Hasher.GenerateHash(user.toString() + Math.random()).getHash();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return sessionToken;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }
}