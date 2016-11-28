package se.secure.foliechatt.domain;

public class Password {
    private String password;
    private String salt;
    private int iterations;

    public Password(String password, String salt, int iterations) {
        this.password = password;
        this.salt = salt;
        this.iterations = iterations;
    }

    public String getPassword() {
        return password;
    }

    public String getSalt() {
        return salt;
    }

    public int getIterations() {
        return iterations;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public void setIterations(int iterations) {
        this.iterations = iterations;
    }
}
