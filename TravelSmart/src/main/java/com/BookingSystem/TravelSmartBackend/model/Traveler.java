package com.BookingSystem.TravelSmartBackend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "travelers")
public class Traveler {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    private String firstName;
    
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    private LocalDate dateOfBirth;
    
    private String nationality;
    
    private String passportNumber;
    
    private LocalDate passportExpiry;
    
    @Enumerated(EnumType.STRING)
    private TravelerType type; // ADULT, CHILD, INFANT
    
    private String email;
    
    private String phone;
    
    public enum Gender {
        MALE, FEMALE, OTHER
    }
    
    public enum TravelerType {
        ADULT, CHILD, INFANT
    }
    
    // Constructors
    public Traveler() {}
    
    public Traveler(Long id, User user, String firstName, String lastName, Gender gender, LocalDate dateOfBirth,
                    String nationality, String passportNumber, LocalDate passportExpiry, TravelerType type,
                    String email, String phone) {
        this.id = id;
        this.user = user;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.nationality = nationality;
        this.passportNumber = passportNumber;
        this.passportExpiry = passportExpiry;
        this.type = type;
        this.email = email;
        this.phone = phone;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    
    public String getPassportNumber() { return passportNumber; }
    public void setPassportNumber(String passportNumber) { this.passportNumber = passportNumber; }
    
    public LocalDate getPassportExpiry() { return passportExpiry; }
    public void setPassportExpiry(LocalDate passportExpiry) { this.passportExpiry = passportExpiry; }
    
    public TravelerType getType() { return type; }
    public void setType(TravelerType type) { this.type = type; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
