# 🎫 Seat Selection Component - Visual Guide

## Overview
The TravelSmart seat selection component dynamically adapts to show different layouts based on the transport type (Bus, Flight, or Train). Each layout is designed to match real-world seating arrangements.

---

## 🚌 Bus Layout

### Features
- **Lower Berth** and **Upper Berth** sections
- Driver position indicator
- Vertical seat arrangement (berth-style)
- Price displayed below each seat
- Color-coded by availability

### Layout Structure
```
LOWER BERTH                    UPPER BERTH
┌─────────────────┐           ┌─────────────────┐
│     [Driver]    │           │                 │
│                 │           │                 │
│ L1  [  ] L2 L3 │           │  [ ] U1 [ ] U2 U3│
│ L4  [  ] L5 L6 │           │  [ ] U4 [ ] U5 U6│
│ L7  [  ] L8 L9 │           │  [ ] U7 [ ] U8 U9│
│ L10 [  ] L11 L12│           │  [ ] U10[ ] U11 U12│
│ L13 [  ] L14 L15│           │  [ ] U13[ ] U14 U15│
└─────────────────┘           └─────────────────┘
```

### Seat Types
- **Lower Berth (L)**: Ground level seats, easier access
- **Upper Berth (U)**: Elevated seats, more privacy

### Visual Indicators
- 🟢 **Green**: Selected seat
- ⚪ **White**: Available seat
- ⚫ **Gray**: Booked/Unavailable seat
- 💺 **Icon**: Armchair icon for available, User icon for selected/booked

### Price Range
- Standard seats: ₹1,530
- Economy seats: ₹1,415

---

## ✈️ Flight Layout

### Features
- Economy class configuration
- Aisle separation (3-3 seating)
- Row numbers (1-8+)
- Column letters (A-F)
- Compact seat display

### Layout Structure
```
ECONOMY CLASS
     A  B     C  D  E  F
   ┌──────────────────────┐
1  │ □  □  |  □  □  □  □ │
2  │ □  □  |  □  □  □  □ │
3  │ □  □  |  □  □  □  □ │
4  │ □  □  |  □  □  □  □ │
5  │ ■  □  |  □  ■  □  □ │
6  │ □  □  |  □  □  □  □ │
7  │ □  □  |  □  □  □  □ │
8  │ □  □  |  □  □  □  □ │
   └──────────────────────┘
```

### Seat Positions
- **A, F**: Window seats
- **B, E**: Middle seats
- **C, D**: Aisle seats

### Visual Indicators
- 🟢 **Green**: Selected seat
- ⚪ **White**: Available seat
- ⚫ **Gray**: Booked/Unavailable seat
- Seat ID displayed (e.g., "1A", "2B")

### Price Range
- Front rows (1-2): ₹2,500 - ₹2,200
- Middle rows (3-5): ₹2,200 - ₹2,000
- Back rows (6-8): ₹1,800

---

## 🚂 Train Layout

### Features
- AC 3-Tier compartment configuration
- Multiple compartments displayed
- Berth type indicators
- Color-coded by berth type
- Detailed seat information

### Layout Structure
```
COACH S1 - AC 3-TIER

COMPARTMENT 1              COMPARTMENT 2
┌──────────────────┐      ┌──────────────────┐
│ 1L  Lower  ₹850  │      │ 3L  Lower  ₹850  │
│ 2L  Lower  ₹850  │      │ 4L  Lower  ₹850  │
├──────────────────┤      ├──────────────────┤
│ 1M  Middle ₹800  │      │ 3M  Middle ₹800  │
│ 2M  Middle ₹800  │      │ 4M  Middle ₹800  │
├──────────────────┤      ├──────────────────┤
│ 1U  Upper  ₹750  │      │ 3U  Upper  ₹750  │
│ 2U  Upper  ₹750  │      │ 4U  Upper  ₹750  │
├──────────────────┤      ├──────────────────┤
│ 1SL Side L ₹850  │      │ 3SL Side L ₹850  │
│ 2SL Side L ₹850  │      │ 4SL Side L ₹850  │
├──────────────────┤      ├──────────────────┤
│ 1SU Side U ₹750  │      │ 3SU Side U ₹750  │
│ 2SU Side U ₹750  │      │ 4SU Side U ₹750  │
└──────────────────┘      └──────────────────┘
```

### Berth Types
- 🔵 **Lower Berth**: Ground level, can sit during day
- 🟢 **Middle Berth**: Mid-level, folds during day
- 🟣 **Upper Berth**: Top level, always available
- 🟠 **Side Lower**: Side section, ground level
- 🟠 **Side Upper**: Side section, top level

### Visual Indicators
- 🟢 **Green**: Selected seat
- 🔵 **Blue tint**: Lower berth
- 🟢 **Green tint**: Middle berth
- 🟣 **Purple tint**: Upper berth
- 🟠 **Orange tint**: Side berth
- ⚫ **Gray**: Booked/Unavailable seat

### Price Range
- Lower & Side Lower: ₹850
- Middle: ₹800
- Upper & Side Upper: ₹750

---

## 🎨 Common Features Across All Layouts

### Selection Controls
- **Click to Select**: Click any available seat to select
- **Click to Deselect**: Click selected seat to remove
- **Maximum Limit**: Default 6 seats (configurable)
- **Clear All**: Button to deselect all seats

### Price Summary
- Real-time total calculation
- Individual seat prices shown
- Selected seats list with remove option
- Continue button with total amount

### Legend
All layouts include a legend showing:
- ⚪ Available seats
- 🟢 Selected seats
- ⚫ Booked/Unavailable seats

---

## 💻 Usage Example

```jsx
import SeatSelection from './components/Booking/SeatSelection';

function BookingPage() {
  const handleSeatsSelected = (seats) => {
    console.log('Selected seats:', seats);
    // Process booking with selected seats
  };

  return (
    <SeatSelection
      type="bus"           // 'bus', 'flight', or 'train'
      onSeatsSelected={handleSeatsSelected}
      maxSeats={6}         // Maximum seats allowed
    />
  );
}
```

---

## 🎯 Demo Page

Visit the interactive demo at: **http://localhost:5173/seat-demo**

Features:
- Switch between Bus, Flight, and Train layouts
- Interactive seat selection
- Real-time price calculation
- Visual feedback on selection
- Responsive design for all screen sizes

---

## 📱 Responsive Design

### Desktop (1024px+)
- Full layout with side-by-side sections (bus)
- Wide flight/train layouts
- All features visible

### Tablet (768px - 1023px)
- Stacked sections for bus
- Compact flight/train layouts
- Touch-optimized buttons

### Mobile (< 768px)
- Single column layout
- Larger touch targets
- Scrollable seat grids
- Sticky price summary

---

## 🎨 Color Scheme

### Primary Colors
- **Cyan**: #06B6D4 (Primary brand color)
- **Blue**: #3B82F6 (Secondary brand color)
- **Green**: #10B981 (Selected state)
- **Gray**: #9CA3AF (Booked state)

### Berth-specific Colors (Train)
- **Blue**: Lower berth (#DBEAFE)
- **Green**: Middle berth (#D1FAE5)
- **Purple**: Upper berth (#E9D5FF)
- **Orange**: Side berth (#FED7AA)

---

## ♿ Accessibility Features

- Keyboard navigation support
- ARIA labels for screen readers
- High contrast colors
- Focus indicators
- Clear visual feedback
- Descriptive button text

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Business/First class flight layouts
- [ ] Sleeper class train layouts
- [ ] Premium bus configurations
- [ ] Seat preferences (window/aisle)
- [ ] Seat recommendations
- [ ] Group seat selection
- [ ] Seat map zoom
- [ ] 3D seat preview
- [ ] Accessibility seat indicators
- [ ] Extra legroom indicators

---

## 📊 Technical Details

### Component Props
```typescript
interface SeatSelectionProps {
  type: 'bus' | 'flight' | 'train';
  onSeatsSelected?: (seats: Seat[]) => void;
  maxSeats?: number;
}

interface Seat {
  id: string;
  price: number;
  booked?: boolean;
  type?: string; // For train berth types
}
```

### State Management
- Local state for seat selection
- Real-time price calculation
- Validation for max seats
- Booked seat prevention

---

**Last Updated**: November 29, 2025
**Component Version**: 1.0
**Status**: Production Ready ✅
