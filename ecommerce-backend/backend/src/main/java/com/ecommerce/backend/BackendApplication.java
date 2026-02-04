package com.ecommerce.backend;

import com.ecommerce.backend.entities.User;
import com.ecommerce.backend.services.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner start(UserService userService) {
		return args -> {
			if (userService.findByUsername("admin") == null) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword("admin123");
				admin.setFirstName("Admin");
				admin.setLastName("System");
				admin.setEmail("admin@ecommerce.com");
				admin.setRole("ROLE_ADMIN");
				userService.saveUser(admin);
				System.out.println("Compte administrateur créé par défaut : admin / admin123");
			}
		};
	}

}
