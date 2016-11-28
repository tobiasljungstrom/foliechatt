package se.secure.foliechatt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Random;

@SpringBootApplication
// @EnableAutoConfiguration
public class SpringController {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(SpringController.class, args);
    }
}
