package com.BookingSystem.TravelSmartBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TravelSmartApplication {

	public static void main(String[] args) {
		SpringApplication.run(TravelSmartApplication.class, args);
	}

}
