package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.*;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class PdfService {
    
    @Autowired
    private FlightService flightService;
    
    @Autowired
    private HotelService hotelService;
    
    @Autowired
    private BusService busService;
    
    @Autowired
    private TrainService trainService;
    
    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(6, 182, 212);
    private static final DeviceRgb SECONDARY_COLOR = new DeviceRgb(59, 130, 246);
    
    public byte[] generateTicketPdf(Booking booking, Payment payment) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);
        
        // Header
        Paragraph header = new Paragraph("TravelSmart")
                .setFontSize(28)
                .setBold()
                .setFontColor(PRIMARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(header);
        
        Paragraph subHeader = new Paragraph("E-Ticket")
                .setFontSize(16)
                .setFontColor(ColorConstants.GRAY)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(subHeader);
        
        // Booking Status
        Paragraph status = new Paragraph("✓ CONFIRMED")
                .setFontSize(14)
                .setBold()
                .setFontColor(ColorConstants.GREEN)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(status);
        
        // Booking Details Table
        Table bookingTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                .useAllAvailableWidth()
                .setMarginBottom(20);
        
        addTableRow(bookingTable, "Booking ID", "#" + booking.getId(), true);
        addTableRow(bookingTable, "Booking Date", booking.getBookingDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")), false);
        addTableRow(bookingTable, "Booking Type", booking.getInventoryType(), false);
        addTableRow(bookingTable, "Number of Seats", String.valueOf(booking.getQuantity()), false);
        addTableRow(bookingTable, "Total Amount", "₹" + booking.getTotalPrice(), true);
        addTableRow(bookingTable, "Payment Status", "PAID", false);
        
        document.add(bookingTable);
        
        // Travel Details
        Paragraph travelHeader = new Paragraph("Travel Details")
                .setFontSize(18)
                .setBold()
                .setFontColor(SECONDARY_COLOR)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(travelHeader);
        
        Table travelTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                .useAllAvailableWidth()
                .setMarginBottom(20);
        
        // Add specific details based on booking type
        addTravelDetails(travelTable, booking);
        
        document.add(travelTable);
        
        // Customer Details
        if (payment != null) {
            Paragraph customerHeader = new Paragraph("Passenger Details")
                    .setFontSize(18)
                    .setBold()
                    .setFontColor(SECONDARY_COLOR)
                    .setMarginTop(20)
                    .setMarginBottom(10);
            document.add(customerHeader);
            
            Table customerTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                    .useAllAvailableWidth()
                    .setMarginBottom(20);
            
            addTableRow(customerTable, "Name", payment.getCustomerName(), false);
            addTableRow(customerTable, "Email", payment.getCustomerEmail(), false);
            addTableRow(customerTable, "Phone", payment.getCustomerPhone(), false);
            
            document.add(customerTable);
        }
        
        // Important Information
        Paragraph importantHeader = new Paragraph("Important Information")
                .setFontSize(14)
                .setBold()
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(importantHeader);
        
        Paragraph info = new Paragraph()
                .add("• Please carry a valid ID proof along with this ticket\n")
                .add("• Arrive at least 2 hours before departure for flights\n")
                .add("• Arrive at least 30 minutes before departure for bus/train\n")
                .add("• This is a computer-generated ticket and does not require a signature\n")
                .setFontSize(10)
                .setFontColor(ColorConstants.DARK_GRAY);
        document.add(info);
        
        // Footer
        Paragraph footer = new Paragraph("Thank you for choosing TravelSmart!")
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(30)
                .setFontColor(ColorConstants.GRAY);
        document.add(footer);
        
        Paragraph contact = new Paragraph("For support: support@travelsmart.com | +91-1800-123-4567")
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.GRAY);
        document.add(contact);
        
        document.close();
        return baos.toByteArray();
    }
    
    private void addTableRow(Table table, String label, String value, boolean highlight) {
        Cell labelCell = new Cell()
                .add(new Paragraph(label).setBold())
                .setBackgroundColor(new DeviceRgb(249, 250, 251))
                .setPadding(10);
        
        Cell valueCell = new Cell()
                .add(new Paragraph(value))
                .setPadding(10);
        
        if (highlight) {
            valueCell.setFontColor(PRIMARY_COLOR).setBold();
        }
        
        table.addCell(labelCell);
        table.addCell(valueCell);
    }
    
    private void addTravelDetails(Table table, Booking booking) {
        String type = booking.getInventoryType();
        Long inventoryId = booking.getInventoryId();
        
        switch (type) {
            case "FLIGHT":
                Optional<Flight> flightOpt = flightService.getFlightById(inventoryId);
                if (flightOpt.isPresent()) {
                    Flight flight = flightOpt.get();
                    addTableRow(table, "Flight Number", flight.getFlightNumber(), false);
                    addTableRow(table, "Airline", flight.getAirline(), false);
                    addTableRow(table, "From", flight.getDepartureCity(), false);
                    addTableRow(table, "To", flight.getArrivalCity(), false);
                    addTableRow(table, "Departure", flight.getDepartureTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")), false);
                    addTableRow(table, "Arrival", flight.getArrivalTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")), false);
                }
                break;
                
            case "HOTEL":
                Optional<Hotel> hotelOpt = hotelService.getHotelById(inventoryId);
                if (hotelOpt.isPresent()) {
                    Hotel hotel = hotelOpt.get();
                    addTableRow(table, "Hotel Name", hotel.getName(), false);
                    addTableRow(table, "City", hotel.getCity(), false);
                    addTableRow(table, "Address", hotel.getAddress(), false);
                    addTableRow(table, "Room Type", hotel.getRoomType(), false);
                    addTableRow(table, "Nightly Rate", "₹" + hotel.getNightlyRate(), false);
                }
                break;
                
            case "BUS":
                Optional<Bus> busOpt = busService.getBusById(inventoryId);
                if (busOpt.isPresent()) {
                    Bus bus = busOpt.get();
                    addTableRow(table, "Bus Number", bus.getBusNumber(), false);
                    addTableRow(table, "Operator", bus.getOperator(), false);
                    addTableRow(table, "From", bus.getOrigin(), false);
                    addTableRow(table, "To", bus.getDestination(), false);
                    addTableRow(table, "Departure", bus.getDepartureTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")), false);
                }
                break;
                
            case "TRAIN":
                Optional<Train> trainOpt = trainService.getTrainById(inventoryId);
                if (trainOpt.isPresent()) {
                    Train train = trainOpt.get();
                    addTableRow(table, "Train Number", train.getTrainNumber(), false);
                    addTableRow(table, "Train Name", train.getTrainName(), false);
                    addTableRow(table, "From", train.getOrigin(), false);
                    addTableRow(table, "To", train.getDestination(), false);
                    addTableRow(table, "Departure", train.getDepartureTime().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")), false);
                }
                break;
        }
    }
}
