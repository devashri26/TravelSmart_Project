-- Sample Flights for TravelSmart
-- Run this in your MySQL database to add test flight data

USE travel_db;

-- Insert sample flights
INSERT INTO flights (flight_number, airline, origin, destination, departure_time, arrival_time, price, available_seats, total_seats)
VALUES 
-- Mumbai to Delhi flights
('AI101', 'Air India', 'Mumbai', 'Delhi', '2025-12-15 06:00:00', '2025-12-15 08:30:00', 4500.00, 150, 180),
('6E202', 'IndiGo', 'Mumbai', 'Delhi', '2025-12-15 09:00:00', '2025-12-15 11:30:00', 3800.00, 160, 180),
('SG303', 'SpiceJet', 'Mumbai', 'Delhi', '2025-12-15 14:00:00', '2025-12-15 16:30:00', 3500.00, 140, 180),

-- Delhi to Mumbai flights
('AI102', 'Air India', 'Delhi', 'Mumbai', '2025-12-15 07:00:00', '2025-12-15 09:30:00', 4500.00, 150, 180),
('6E203', 'IndiGo', 'Delhi', 'Mumbai', '2025-12-15 12:00:00', '2025-12-15 14:30:00', 3800.00, 160, 180),
('SG304', 'SpiceJet', 'Delhi', 'Mumbai', '2025-12-15 18:00:00', '2025-12-15 20:30:00', 3500.00, 140, 180),

-- Bangalore to Delhi flights
('AI201', 'Air India', 'Bangalore', 'Delhi', '2025-12-15 06:30:00', '2025-12-15 09:30:00', 5200.00, 150, 180),
('6E301', 'IndiGo', 'Bangalore', 'Delhi', '2025-12-15 10:00:00', '2025-12-15 13:00:00', 4800.00, 160, 180),

-- Delhi to Bangalore flights
('AI202', 'Air India', 'Delhi', 'Bangalore', '2025-12-15 08:00:00', '2025-12-15 11:00:00', 5200.00, 150, 180),
('6E302', 'IndiGo', 'Delhi', 'Bangalore', '2025-12-15 15:00:00', '2025-12-15 18:00:00', 4800.00, 160, 180),

-- Mumbai to Bangalore flights
('AI301', 'Air India', 'Mumbai', 'Bangalore', '2025-12-15 07:30:00', '2025-12-15 09:30:00', 3800.00, 150, 180),
('6E401', 'IndiGo', 'Mumbai', 'Bangalore', '2025-12-15 13:00:00', '2025-12-15 15:00:00', 3500.00, 160, 180),

-- Bangalore to Mumbai flights
('AI302', 'Air India', 'Bangalore', 'Mumbai', '2025-12-15 10:00:00', '2025-12-15 12:00:00', 3800.00, 150, 180),
('6E402', 'IndiGo', 'Bangalore', 'Mumbai', '2025-12-15 16:00:00', '2025-12-15 18:00:00', 3500.00, 160, 180);

-- Verify the flights were added
SELECT flight_number, airline, origin, destination, departure_time, price, available_seats 
FROM flights 
ORDER BY origin, destination, departure_time;
