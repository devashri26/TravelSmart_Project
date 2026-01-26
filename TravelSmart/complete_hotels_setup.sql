-- ============================================
-- COMPLETE HOTELS DATABASE SETUP
-- Run this entire script in MySQL Workbench
-- ============================================

USE travelsmart_db;

-- ============================================
-- STEP 1: ADD NEW COLUMNS TO HOTELS TABLE
-- ============================================

ALTER TABLE hotels 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(1000) AFTER available_rooms,
ADD COLUMN IF NOT EXISTS rating DOUBLE AFTER image_url,
ADD COLUMN IF NOT EXISTS description VARCHAR(2000) AFTER rating,
ADD COLUMN IF NOT EXISTS amenities VARCHAR(500) AFTER description,
ADD COLUMN IF NOT EXISTS star_rating VARCHAR(50) AFTER amenities,
ADD COLUMN IF NOT EXISTS breakfast_included BOOLEAN AFTER star_rating,
ADD COLUMN IF NOT EXISTS free_cancellation BOOLEAN AFTER breakfast_included;

-- Verify the changes
SELECT 'Columns added successfully!' AS status;
DESCRIBE hotels;

-- ============================================
-- STEP 2: INSERT ENHANCED HOTEL DATA
-- ============================================

-- Mumbai Hotels (4 hotels)
INSERT INTO hotels (name, city, address, room_type, nightly_rate, total_rooms, available_rooms, image_url, rating, description, amenities, star_rating, breakfast_included, free_cancellation) VALUES
('Taj Mahal Palace', 'Mumbai', 'Apollo Bunder, Colaba', 'Deluxe Room', 15000.00, 50, 45, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 4.8, 'Iconic luxury hotel overlooking the Gateway of India with world-class amenities and stunning sea views.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Room Service,Parking', '5-Star', true, true),
('The Oberoi Mumbai', 'Mumbai', 'Nariman Point', 'Premium Suite', 18000.00, 30, 28, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 4.9, 'Ultra-luxury hotel with panoramic views of the Arabian Sea and Marine Drive.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Concierge,Valet', '5-Star', true, true),
('Hotel Marine Plaza', 'Mumbai', 'Marine Drive', 'Standard Room', 8000.00, 80, 75, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 4.3, 'Comfortable hotel on Marine Drive with excellent city and sea views.', 'WiFi,Restaurant,Room Service,Parking,AC', '4-Star', true, false),
('Treebo Trend', 'Mumbai', 'Andheri East', 'Economy Room', 3500.00, 40, 38, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 4.0, 'Budget-friendly hotel near the airport with modern amenities.', 'WiFi,AC,TV,Breakfast', '3-Star', true, true);

-- Delhi Hotels (4 hotels)
INSERT INTO hotels (name, city, address, room_type, nightly_rate, total_rooms, available_rooms, image_url, rating, description, amenities, star_rating, breakfast_included, free_cancellation) VALUES
('The Leela Palace', 'Delhi', 'Chanakyapuri', 'Royal Suite', 20000.00, 25, 22, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 4.9, 'Opulent palace hotel with regal architecture and impeccable service.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Butler Service,Valet', '5-Star', true, true),
('ITC Maurya', 'Delhi', 'Sardar Patel Marg', 'Executive Room', 12000.00, 60, 55, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 4.7, 'Luxury hotel known for its Bukhara restaurant and world-class hospitality.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Business Center', '5-Star', true, true),
('Radisson Blu', 'Delhi', 'Mahipalpur', 'Deluxe Room', 7000.00, 100, 92, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 4.4, 'Modern hotel near the airport with excellent facilities.', 'WiFi,Pool,Gym,Restaurant,Parking,Shuttle', '4-Star', true, false),
('FabHotel Prime', 'Delhi', 'Karol Bagh', 'Standard Room', 2500.00, 50, 48, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 3.9, 'Affordable hotel in central Delhi with basic amenities.', 'WiFi,AC,TV,Breakfast', '3-Star', true, true);

-- Bangalore Hotels (4 hotels)
INSERT INTO hotels (name, city, address, room_type, nightly_rate, total_rooms, available_rooms, image_url, rating, description, amenities, star_rating, breakfast_included, free_cancellation) VALUES
('The Ritz-Carlton', 'Bangalore', 'Residency Road', 'Luxury Suite', 16000.00, 35, 30, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 4.8, 'Sophisticated luxury hotel in the heart of Bangalore with exceptional service.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Concierge,Valet', '5-Star', true, true),
('Taj West End', 'Bangalore', 'Race Course Road', 'Heritage Room', 14000.00, 45, 40, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 4.7, 'Historic hotel set in 20 acres of lush gardens with colonial charm.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Garden,Parking', '5-Star', true, true),
('Lemon Tree Premier', 'Bangalore', 'Whitefield', 'Superior Room', 6000.00, 70, 65, 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800', 4.2, 'Contemporary hotel in the IT hub with modern amenities.', 'WiFi,Gym,Restaurant,Parking,Business Center', '4-Star', true, false),
('Zostel', 'Bangalore', 'Koramangala', 'Shared Dorm', 800.00, 20, 18, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 4.1, 'Vibrant hostel for backpackers and solo travelers.', 'WiFi,Common Area,Kitchen,Lockers', 'Hostel', false, true);

-- Goa Hotels (4 hotels)
INSERT INTO hotels (name, city, address, room_type, nightly_rate, total_rooms, available_rooms, image_url, rating, description, amenities, star_rating, breakfast_included, free_cancellation) VALUES
('Taj Exotica', 'Goa', 'Benaulim Beach', 'Beach Villa', 22000.00, 40, 35, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 4.9, 'Luxurious beach resort with private villas and stunning ocean views.', 'WiFi,Pool,Beach Access,Spa,Restaurant,Bar,Water Sports', '5-Star', true, true),
('Alila Diwa', 'Goa', 'Majorda Beach', 'Premium Room', 18000.00, 55, 50, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800', 4.8, 'Contemporary resort blending Goan architecture with modern luxury.', 'WiFi,Pool,Spa,Restaurant,Bar,Gym,Beach Access', '5-Star', true, true),
('Lemon Tree Amarante', 'Goa', 'Candolim', 'Deluxe Room', 8000.00, 80, 72, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', 4.3, 'Beachfront hotel with vibrant atmosphere and great amenities.', 'WiFi,Pool,Restaurant,Bar,Beach Access,Parking', '4-Star', true, false),
('Backpacker Panda', 'Goa', 'Anjuna', 'Private Room', 1500.00, 30, 28, 'https://images.unsplash.com/photo-1559599238-1c99d5f5e6e1?w=800', 4.0, 'Budget-friendly accommodation near Anjuna Beach.', 'WiFi,Common Area,Kitchen,Bike Rental', 'Hostel', false, true);

-- Jaipur Hotels (4 hotels)
INSERT INTO hotels (name, city, address, room_type, nightly_rate, total_rooms, available_rooms, image_url, rating, description, amenities, star_rating, breakfast_included, free_cancellation) VALUES
('Rambagh Palace', 'Jaipur', 'Bhawani Singh Road', 'Palace Suite', 25000.00, 30, 25, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', 4.9, 'Former royal palace turned luxury hotel with regal grandeur.', 'WiFi,Pool,Spa,Restaurant,Bar,Heritage Tours,Butler Service', '5-Star', true, true),
('Fairmont Jaipur', 'Jaipur', 'Riico Kukas', 'Deluxe Room', 15000.00, 65, 60, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 4.7, 'Majestic hotel inspired by Mughal architecture with modern amenities.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Golf Course', '5-Star', true, true),
('Clarks Amer', 'Jaipur', 'Jawaharlal Nehru Marg', 'Superior Room', 7000.00, 90, 85, 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=800', 4.3, 'Well-located hotel near major attractions with comfortable rooms.', 'WiFi,Pool,Restaurant,Parking,Travel Desk', '4-Star', true, false),
('Zostel Jaipur', 'Jaipur', 'MI Road', 'Dorm Bed', 600.00, 25, 22, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 4.1, 'Social hostel in the heart of Pink City.', 'WiFi,Common Area,Kitchen,City Tours', 'Hostel', false, true);

-- Pune Hotels (4 hotels)
INSERT INTO hotels (name, city, address, room_type, nightly_rate, total_rooms, available_rooms, image_url, rating, description, amenities, star_rating, breakfast_included, free_cancellation) VALUES
('JW Marriott', 'Pune', 'Senapati Bapat Road', 'Executive Room', 12000.00, 75, 70, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 4.7, 'Upscale hotel with modern amenities and excellent dining options.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Business Center', '5-Star', true, true),
('The Westin', 'Pune', 'Koregaon Park', 'Deluxe Room', 10000.00, 60, 55, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 4.6, 'Contemporary hotel with wellness-focused amenities.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Parking', '5-Star', true, true),
('Lemon Tree Hotel', 'Pune', 'Viman Nagar', 'Standard Room', 5000.00, 85, 80, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 4.2, 'Comfortable hotel near the airport with good facilities.', 'WiFi,Restaurant,Gym,Parking,Shuttle', '4-Star', true, false),
('Treebo Trend', 'Pune', 'Shivajinagar', 'Economy Room', 2800.00, 45, 42, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 3.9, 'Budget hotel in central Pune with basic amenities.', 'WiFi,AC,TV,Breakfast', '3-Star', true, true);

-- Chennai Hotels (4 hotels)
INSERT INTO hotels (name, city, address, room_type, nightly_rate, total_rooms, available_rooms, image_url, rating, description, amenities, star_rating, breakfast_included, free_cancellation) VALUES
('ITC Grand Chola', 'Chennai', 'Guindy', 'Luxury Suite', 17000.00, 40, 35, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 4.8, 'Grand luxury hotel inspired by Chola architecture.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Business Center', '5-Star', true, true),
('The Leela Palace', 'Chennai', 'Adyar', 'Deluxe Room', 14000.00, 50, 45, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 4.7, 'Elegant hotel on the Bay of Bengal with stunning views.', 'WiFi,Pool,Gym,Spa,Restaurant,Bar,Beach Access', '5-Star', true, true),
('Radisson Blu', 'Chennai', 'Egmore', 'Standard Room', 6500.00, 70, 65, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 4.3, 'Centrally located hotel with modern amenities.', 'WiFi,Pool,Restaurant,Gym,Parking', '4-Star', true, false),
('FabHotel', 'Chennai', 'T Nagar', 'Economy Room', 2200.00, 35, 32, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 3.9, 'Budget hotel in shopping district.', 'WiFi,AC,TV,Breakfast', '3-Star', true, true);

COMMIT;

-- ============================================
-- STEP 3: VERIFY THE SETUP
-- ============================================

SELECT '✅ Setup Complete!' AS status;

-- Show table structure
SELECT 'Table Structure:' AS info;
DESCRIBE hotels;

-- Show sample data
SELECT 'Sample Hotels:' AS info;
SELECT name, city, nightly_rate, rating, star_rating, breakfast_included 
FROM hotels 
LIMIT 10;

-- Show count by city
SELECT 'Hotels by City:' AS info;
SELECT city, COUNT(*) as hotel_count 
FROM hotels 
GROUP BY city 
ORDER BY hotel_count DESC;

-- Show total count
SELECT 'Total Hotels:' AS info;
SELECT COUNT(*) as total_hotels FROM hotels;

SELECT '✅ All Done! You can now restart your Spring Boot backend.' AS final_message;
