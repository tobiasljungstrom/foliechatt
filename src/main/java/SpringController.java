import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;

@Controller
@EnableAutoConfiguration
public class SpringController {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(SpringController.class, args);
    }
}
