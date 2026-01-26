import { useState } from "react";
import { MapPin, Calendar, DollarSign, Sparkles, Loader2, Download, Leaf, Phone, Hospital, Shield, Clock, Users, TreePine, AlertTriangle, Star, MapIcon } from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import toast from "react-hot-toast";
import tripPlannerService from "../services/tripPlannerService";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TripPlannerPage = () => {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 1,
    interests: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const interestOptions = [
    { id: "adventure", label: "Adventure", icon: "" },
    { id: "culture", label: "Culture", icon: "" },
    { id: "food", label: "Food", icon: "" },
    { id: "nature", label: "Nature", icon: "" },
    { id: "shopping", label: "Shopping", icon: "" },
    { id: "nightlife", label: "Nightlife", icon: "" },
    { id: "history", label: "History", icon: "" },
    { id: "beach", label: "Beach", icon: "" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateItinerary = async (e) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget || formData.interests.length === 0) {
      toast.error("Please fill all fields and select at least one interest");
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await tripPlannerService.generateItinerary({
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: parseInt(formData.budget),
        travelers: parseInt(formData.travelers),
        interests: formData.interests
      });
      
      setItinerary(response);
      toast.success("Itinerary generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  const downloadPDF = async () => {
  try {
    // Show loading state
    const button = document.querySelector('[data-pdf-download]');
    const originalText = button.innerHTML;
    button.innerHTML = '<svg class="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating PDF...';
    
    // Create a temporary container for PDF content
    const pdfContent = document.createElement('div');
    pdfContent.style.width = '210mm'; // A4 width
    pdfContent.style.padding = '20px';
    pdfContent.style.backgroundColor = 'white';
    pdfContent.style.fontFamily = 'Arial, sans-serif';
    
    // Generate PDF content
    pdfContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7c3aed; font-size: 28px; margin: 0;">Smart AI Trip Planner</h1>
        <h2 style="color: #374151; font-size: 20px; margin: 10px 0;">Travel Itinerary for ${itinerary.destination}</h2>
        <p style="color: #6b7280; margin: 0;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #374151; border-bottom: 2px solid #7c3aed; padding-bottom: 5px;">Daily Itinerary</h3>
        ${itinerary.days?.map(day => `
          <div style="margin-bottom: 20px; border-left: 4px solid #7c3aed; padding-left: 15px;">
            <h4 style="color: #374151; margin: 0 0 10px 0;">Day ${day.day}: ${day.title}</h4>
            ${day.activities?.map(activity => `
              <div style="margin-bottom: 10px; padding: 10px; background-color: #f9fafb; border-radius: 5px;">
                <div style="font-weight: bold; color: #7c3aed; font-size: 14px;">${activity.time}</div>
                <div style="font-weight: bold; color: #374151; margin: 5px 0;">${activity.activity}</div>
                <div style="color: #6b7280; font-size: 14px;">
                  📍 ${activity.location} • ⏱️ ${activity.duration} • 💰 ₹${activity.cost}
                  ${activity.ecoFriendly ? ' • 🌿 Eco-friendly' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #374151; border-bottom: 2px solid #7c3aed; padding-bottom: 5px;">Budget Breakdown</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px;">
          ${itinerary.estimatedBudget ? Object.entries(itinerary.estimatedBudget).map(([key, value]) => 
            key !== 'total' ? `
              <div style="text-align: center; padding: 10px; background-color: #f9fafb; border-radius: 5px;">
                <div style="color: #6b7280; font-size: 14px; text-transform: capitalize;">${key}</div>
                <div style="font-weight: bold; color: #374151; font-size: 16px;">₹${value}</div>
              </div>
            ` : ''
          ).join('') : ''}
        </div>
        <div style="text-align: center; padding: 15px; background-color: #ecfdf5; border-radius: 5px; border: 2px solid #10b981;">
          <span style="font-size: 18px; font-weight: bold; color: #374151;">Total Budget: </span>
          <span style="font-size: 24px; font-weight: bold; color: #10b981;">₹${itinerary.estimatedBudget?.total}</span>
        </div>
      </div>
      
      ${itinerary.carbonFootprint ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; border-bottom: 2px solid #7c3aed; padding-bottom: 5px;">Environmental Impact</h3>
          <div style="padding: 15px; background-color: #f0fdf4; border-radius: 5px; margin-bottom: 15px;">
            <div style="text-align: center;">
              <div style="font-weight: bold; color: #374151; font-size: 18px;">Total Carbon Footprint: ${itinerary.carbonFootprint.total} kg CO₂</div>
              <div style="color: ${itinerary.carbonFootprint.rating === 'Low' ? '#10b981' : itinerary.carbonFootprint.rating === 'Medium' ? '#f59e0b' : '#ef4444'}; font-weight: bold;">
                ${itinerary.carbonFootprint.rating} Impact
              </div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
            <div style="text-align: center; padding: 10px; background-color: #dbeafe; border-radius: 5px;">
              <div style="color: #6b7280; font-size: 14px;">Flight</div>
              <div style="font-weight: bold; color: #2563eb;">${itinerary.carbonFootprint.flight} kg</div>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #dcfce7; border-radius: 5px;">
              <div style="color: #6b7280; font-size: 14px;">Hotel</div>
              <div style="font-weight: bold; color: #16a34a;">${itinerary.carbonFootprint.accommodation} kg</div>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #fef3c7; border-radius: 5px;">
              <div style="color: #6b7280; font-size: 14px;">Transport</div>
              <div style="font-weight: bold; color: #d97706;">${itinerary.carbonFootprint.transport} kg</div>
            </div>
            <div style="text-align: center; padding: 10px; background-color: #f3e8ff; border-radius: 5px;">
              <div style="color: #6b7280; font-size: 14px;">Activities</div>
              <div style="font-weight: bold; color: #9333ea;">${itinerary.carbonFootprint.activities} kg</div>
            </div>
          </div>
          <div style="padding: 15px; background-color: #f0fdf4; border-radius: 5px;">
            <div style="font-weight: bold; color: #166534; margin-bottom: 10px;">🌳 Offset Your Impact</div>
            <div style="color: #166534; font-size: 14px; margin-bottom: 10px;">
              Plant ${itinerary.carbonFootprint.treesToOffset} trees to offset your carbon footprint
            </div>
            <div style="color: #166534; font-size: 14px;">
              ${itinerary.carbonFootprint.ecoAlternatives?.map(alt => `• ${alt}`).join('<br>')}
            </div>
          </div>
        </div>
      ` : ''}
      
      ${itinerary.emergencyContacts ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; border-bottom: 2px solid #7c3aed; padding-bottom: 5px;">Emergency Contacts & Safety</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            ${Object.entries(itinerary.emergencyContacts).map(([key, value]) => `
              <div style="padding: 10px; background-color: #fef2f2; border-radius: 5px;">
                <div style="font-weight: bold; color: #374151; text-transform: capitalize; margin-bottom: 5px;">
                  ${key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div style="color: #6b7280; font-size: 14px;">${value}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${itinerary.attractions ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; border-bottom: 2px solid #7c3aed; padding-bottom: 5px;">Top Attractions</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            ${itinerary.attractions.map(attraction => `
              <div style="padding: 15px; border: 1px solid #d1d5db; border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                  <div style="font-weight: bold; color: #374151;">${attraction.name}</div>
                  <div style="color: #f59e0b;">⭐ ${attraction.rating}</div>
                </div>
                <div style="display: flex; justify-content: space-between; color: #6b7280; font-size: 14px;">
                  <span>${attraction.distance} away</span>
                  <span style="font-weight: bold; color: #10b981;">
                    ${attraction.entryFee === 0 ? 'Free' : `₹${attraction.entryFee}`}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #d1d5db; color: #6b7280; font-size: 14px;">
        <p>Generated by TravelSmart AI Trip Planner</p>
        <p>Have a safe and wonderful journey! 🌟</p>
      </div>
    `;
    
    // Temporarily add to DOM for rendering
    document.body.appendChild(pdfContent);
    
    // Generate canvas from HTML
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Remove temporary element
    document.body.removeChild(pdfContent);
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Download the PDF
    const fileName = `TravelSmart_Itinerary_${itinerary.destination.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    // Restore button
    button.innerHTML = originalText;
    toast.success('PDF downloaded successfully!');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF. Please try again.');
    
    // Restore button on error
    const button = document.querySelector('[data-pdf-download]');
    if (button) {
      button.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>Download PDF';
    }
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Smart AI Trip Planner
          </h1>
          <p className="text-gray-600 text-lg">
            Personalized  Sustainable  Safe  Intelligent
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Plan Your Trip
            </h2>

            <form onSubmit={generateItinerary} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g., Paris, Tokyo, Bali, Goa"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="50000"
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Interests
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map(interest => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
                        formData.interests.includes(interest.id)
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {interest.icon} {interest.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Generate Smart Itinerary
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3 space-y-6">
            {itinerary ? (
              <>
                {/* Daily Itinerary */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-purple-600" />
                      Your Personalized Itinerary
                    </h2>
<button 
  onClick={downloadPDF}
  data-pdf-download
  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
>
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {itinerary.days?.map((day) => (
                      <div key={day.day} className="border-l-4 border-purple-600 pl-4 pb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          Day {day.day}: {day.title}
                        </h3>
                        <div className="space-y-3">
                          {day.activities?.map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                              <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-bold text-purple-600">
                                    {activity.time}
                                  </span>
                                  {activity.ecoFriendly && (
                                    <Leaf className="w-4 h-4 text-green-600" title="Eco-friendly activity" />
                                  )}
                                </div>
                                <p className="font-semibold text-gray-900">{activity.activity}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <MapIcon className="w-3 h-3" />
                                    {activity.location}
                                  </span>
                                  <span>{activity.duration}</span>
                                  <span className="font-semibold text-green-600">₹{activity.cost}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Budget Breakdown */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Budget Breakdown
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {itinerary.estimatedBudget && Object.entries(itinerary.estimatedBudget).map(([key, value]) => (
                      key !== 'total' && (
                        <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-sm text-gray-600 capitalize">{key}</p>
                          <p className="text-lg font-bold text-gray-900">₹{value}</p>
                        </div>
                      )
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Budget:</span>
                      <span className="text-2xl font-bold text-green-600">₹{itinerary.estimatedBudget?.total}</span>
                    </div>
                  </div>
                </div>

                {/* Carbon Footprint */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Environmental Impact
                  </h3>
                  {itinerary.carbonFootprint && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">Total Carbon Footprint</p>
                          <p className="text-sm text-gray-600">CO₂ emissions for this trip</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{itinerary.carbonFootprint.total} kg</p>
                          <p className={`text-sm font-semibold ${
                            itinerary.carbonFootprint.rating === 'Low' ? 'text-green-600' :
                            itinerary.carbonFootprint.rating === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {itinerary.carbonFootprint.rating} Impact
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Flight</p>
                          <p className="font-bold text-blue-600">{itinerary.carbonFootprint.flight} kg</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Hotel</p>
                          <p className="font-bold text-green-600">{itinerary.carbonFootprint.accommodation} kg</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-600">Transport</p>
                          <p className="font-bold text-yellow-600">{itinerary.carbonFootprint.transport} kg</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">Activities</p>
                          <p className="font-bold text-purple-600">{itinerary.carbonFootprint.activities} kg</p>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TreePine className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800">Offset Your Impact</span>
                        </div>
                        <p className="text-sm text-green-700 mb-3">
                          Plant {itinerary.carbonFootprint.treesToOffset} trees to offset your carbon footprint
                        </p>
                        <div className="space-y-2">
                          {itinerary.carbonFootprint.ecoAlternatives?.map((alternative, idx) => (
                            <p key={idx} className="text-sm text-green-700 flex items-center gap-2">
                              <Leaf className="w-3 h-3" />
                              {alternative}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Emergency Contacts & Safety */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    Emergency Contacts & Safety
                  </h3>
                  {itinerary.emergencyContacts && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(itinerary.emergencyContacts).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                          {key === 'police' && <Shield className="w-5 h-5 text-red-600" />}
                          {key === 'ambulance' && <Hospital className="w-5 h-5 text-red-600" />}
                          {key === 'touristHelpline' && <Phone className="w-5 h-5 text-red-600" />}
                          {key === 'nearbyHospital' && <Hospital className="w-5 h-5 text-red-600" />}
                          {key === 'embassy' && <Shield className="w-5 h-5 text-red-600" />}
                          <div>
                            <p className="font-semibold text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm text-gray-600">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Top Attractions */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    Top Attractions
                  </h3>
                  {itinerary.attractions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {itinerary.attractions.map((attraction, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{attraction.name}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold">{attraction.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{attraction.distance} away</span>
                            <span className="font-semibold text-green-600">
                              {attraction.entryFee === 0 ? 'Free' : `₹${attraction.entryFee}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <Sparkles className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Plan Your Dream Trip?
                </h3>
                <p className="text-gray-600 mb-6">
                  Fill in your preferences and let our AI create a personalized, sustainable, and safe itinerary for you!
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <Sparkles className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                    <p className="font-semibold">AI-Powered</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <Leaf className="w-6 h-6 mx-auto text-green-600 mb-2" />
                    <p className="font-semibold">Sustainable</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <Shield className="w-6 h-6 mx-auto text-red-600 mb-2" />
                    <p className="font-semibold">Safe</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <Download className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                    <p className="font-semibold">Offline Ready</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlannerPage;
