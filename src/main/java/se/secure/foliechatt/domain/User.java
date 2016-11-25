package se.secure.foliechatt.domain;


import javax.persistence.*;

@Entity
@NamedQueries(
        @NamedQuery(name = "User.findByEmail", query = "SELECT u FROM User u WHERE u.email = :email")
)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String alias;
    private String email;
    private String password;
    private String salt;
    private Integer iterations;

    public User() {
    }

    public User(String alias) {
        this.alias = alias;

    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public Integer getIterations() {
        return iterations;
    }

    public void setIterations(Integer iterations) {
        this.iterations = iterations;
    }
}
