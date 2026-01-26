package com.BookingSystem.TravelSmartBackend.repository;

import com.BookingSystem.TravelSmartBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@Transactional(readOnly = true) // Set read-only by default for safety
public interface UserRepository extends JpaRepository<User, Long> {

    // Used during registration to check if a username is already taken
    Optional<User> findByUsername(String username);

    // Used during registration to check if an email is already registered
    Optional<User> findByEmail(String email);
    
    // Check if username exists
    boolean existsByUsername(String username);

    /**
     * Custom method to set the 'enabled' field to TRUE for a user with the given email.
     * This is called upon successful email confirmation.
     */
    @Transactional
    @Modifying
    @Query("UPDATE User u " +
            "SET u.enabled = TRUE " +
            "WHERE u.email = ?1")
    int enableUser(String email);
    
    // Admin query methods
    long countByEnabled(boolean enabled);
    
    org.springframework.data.domain.Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String username, String email, org.springframework.data.domain.Pageable pageable);
}