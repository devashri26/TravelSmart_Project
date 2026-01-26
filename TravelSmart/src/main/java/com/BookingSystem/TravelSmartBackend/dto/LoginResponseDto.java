package com.BookingSystem.TravelSmartBackend.dto;

public class LoginResponseDto {
    private String token;
    private String username;
    private String role;
    
    public LoginResponseDto() {}
    
    public LoginResponseDto(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }
    
    public static LoginResponseDtoBuilder builder() {
        return new LoginResponseDtoBuilder();
    }
    
    public static class LoginResponseDtoBuilder {
        private String token;
        private String username;
        private String role;
        
        public LoginResponseDtoBuilder token(String token) { this.token = token; return this; }
        public LoginResponseDtoBuilder username(String username) { this.username = username; return this; }
        public LoginResponseDtoBuilder role(String role) { this.role = role; return this; }
        
        public LoginResponseDto build() {
            return new LoginResponseDto(token, username, role);
        }
    }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
