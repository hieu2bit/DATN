package backend.datn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DatnApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatnApplication.class, args);
    }

}
