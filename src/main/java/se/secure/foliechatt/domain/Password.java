package se.secure.foliechatt.domain;

public class Password {
    private String hash;
    private String salt;
    private int iterations;

    public Password(String hash, String salt, int iterations) {
        this.hash = hash;
        this.salt = salt;
        this.iterations = iterations;
    }

    public String getHash() {
        return hash;
    }

    public String getSalt() {
        return salt;
    }

    public int getIterations() {
        return iterations;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public void setIterations(int iterations) {
        this.iterations = iterations;
    }
}
