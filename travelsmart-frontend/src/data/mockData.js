// Mock data for testing without backend

export const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Goa',
  'Kochi', 'Indore', 'Bhopal', 'Nagpur', 'Surat', 'Vadodara'
];

export const airports = [
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji International' },
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International' },
  { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur International' },
  { code: 'GOI', city: 'Goa', name: 'Goa International' },
];

export const mockFlights = [
  {
    id: 'FL001',
    airline: 'Air India',
    flightNumber: 'AI 101',
    origin: 'Mumbai',
    destination: 'Delhi',
    departureTime: '06:00',
    arrivalTime: '08:30',
    duration: '2h 30m',
    price: 4500,
    availableSeats: 45,
    class: 'Economy'
  },
  {
    id: 'FL002',
    airline: 'IndiGo',
    flightNumber: '6E 202',
    origin: 'Mumbai',
    destination: 'Delhi',
    departureTime: '09:15',
    arrivalTime: '11:45',
    duration: '2h 30m',
    price: 3800,
    availableSeats: 32,
    class: 'Economy'
  },
  {
    id: 'FL003',
    airline: 'SpiceJet',
    flightNumber: 'SG 303',
    origin: 'Mumbai',
    destination: 'Delhi',
    departureTime: '14:30',
    arrivalTime: '17:00',
    duration: '2h 30m',
    price: 3500,
    availableSeats: 28,
    class: 'Economy'
  },
  {
    id: 'FL004',
    airline: 'Vistara',
    flightNumber: 'UK 404',
    origin: 'Mumbai',
    destination: 'Delhi',
    departureTime: '18:45',
    arrivalTime: '21:15',
    duration: '2h 30m',
    price: 5200,
    availableSeats: 50,
    class: 'Economy'
  },
];

export const mockBuses = [
  {
    id: 'BUS001',
    operator: 'VRL Travels',
    busType: 'AC Sleeper',
    origin: 'Mumbai',
    destination: 'Pune',
    departureTime: '22:00',
    arrivalTime: '04:30',
    duration: '6h 30m',
    price: 800,
    availableSeats: 25,
    amenities: ['AC', 'WiFi', 'Charging Point', 'Water Bottle']
  },
  {
    id: 'BUS002',
    operator: 'RedBus Express',
    busType: 'Non-AC Seater',
    origin: 'Mumbai',
    destination: 'Pune',
    departureTime: '06:00',
    arrivalTime: '10:00',
    duration: '4h',
    price: 450,
    availableSeats: 35,
    amenities: ['Charging Point', 'Water Bottle']
  },
  {
    id: 'BUS003',
    operator: 'Orange Travels',
    busType: 'AC Semi-Sleeper',
    origin: 'Mumbai',
    destination: 'Pune',
    departureTime: '23:30',
    arrivalTime: '05:00',
    duration: '5h 30m',
    price: 650,
    availableSeats: 30,
    amenities: ['AC', 'Charging Point', 'Blanket']
  },
];

export const mockTrains = [
  {
    id: 'TRN001',
    trainNumber: '12345',
    name: 'Rajdhani Express',
    origin: 'Mumbai',
    destination: 'Delhi',
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    price: 1530,
    availableSeats: 45,
    class: 'AC 3-Tier'
  },
  {
    id: 'TRN002',
    trainNumber: '12951',
    name: 'Mumbai Rajdhani',
    origin: 'Mumbai',
    destination: 'Delhi',
    departureTime: '17:00',
    arrivalTime: '09:15',
    duration: '16h 15m',
    price: 1415,
    availableSeats: 38,
    class: 'AC 3-Tier'
  },
  {
    id: 'TRN003',
    trainNumber: '12137',
    name: 'Punjab Mail',
    origin: 'Mumbai',
    destination: 'Delhi',
    departureTime: '19:40',
    arrivalTime: '14:30',
    duration: '18h 50m',
    price: 850,
    availableSeats: 52,
    class: 'Sleeper'
  },
];

export const mockHotels = [
  {
    id: 'HTL001',
    name: 'The Taj Mahal Palace',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    reviews: 1250,
    pricePerNight: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Bar']
  },
  {
    id: 'HTL002',
    name: 'ITC Grand Central',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    reviews: 980,
    pricePerNight: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    amenities: ['Pool', 'Restaurant', 'WiFi', 'Gym', 'Spa']
  },
  {
    id: 'HTL003',
    name: 'Hotel Suba Palace',
    location: 'Mumbai, Maharashtra',
    rating: 4,
    reviews: 650,
    pricePerNight: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    amenities: ['Restaurant', 'WiFi', 'Room Service']
  },
  {
    id: 'HTL004',
    name: 'The Oberoi',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    reviews: 1450,
    pricePerNight: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Bar', 'Concierge']
  },
  {
    id: 'HTL005',
    name: 'Treebo Trend',
    location: 'Mumbai, Maharashtra',
    rating: 3,
    reviews: 320,
    pricePerNight: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    amenities: ['WiFi', 'Breakfast', 'Room Service']
  },
];
