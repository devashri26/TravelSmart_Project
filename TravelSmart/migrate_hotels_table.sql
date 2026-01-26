-- Migration script to add new columns to hotels table
-- Run this BEFORE running add_enhanced_hotels.sql

USE travelsmart_db;

-- Add new columns to hotels table
ALTER TABLE hotels 
ADD COLUMN image_url VARCHAR(1000) AFTER available_rooms,
ADD COLUMN rating DOUBLE AFTER image_url,
ADD COLUMN description VARCHAR(2000) AFTER rating,
ADD COLUMN amenities VARCHAR(500) AFTER description,
ADD COLUMN star_rating VARCHAR(50) AFTER amenities,
ADD COLUMN breakfast_included BOOLEAN AFTER star_rating,
ADD COLUMN free_cancellation BOOLEAN AFTER breakfast_included;

-- Verify the changes
DESCRIBE hotels;

-- Update existing hotels with default values (optional)
UPDATE hotels 
SET 
    image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    rating = 4.0,
    description = 'Comfortable hotel with modern amenities',
    amenities = 'WiFi,AC,TV',
    star_rating = '3-Star',
    breakfast_included = false,
    free_cancellation = false
WHERE image_url IS NULL;

COMMIT;

SELECT 'Migration completed successfully!' AS status;
