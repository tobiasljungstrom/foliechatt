package se.secure.foliechatt.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @JsonIgnore
    private String salt;
    @JsonIgnore
    private Integer iterations;

    public User() {
    }

    public User(String alias) {
        this.alias = alias;

    }

    @JsonIgnore
    public void setFullPassword(Password password) {
        this.password = password.getHash();
        this.salt = password.getSalt();
        this.iterations = password.getIterations();
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

    public Integer getIterations() {
        return iterations;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", alias='" + alias + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", salt='" + salt + '\'' +
                ", iterations=" + iterations +
                '}';
    }
}
