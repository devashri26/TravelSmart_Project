import { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Users, DollarSign, Sparkles, Loader2, Download, 
  Leaf, Phone, Hospital, Shield, Clock, Star, Edit3, Trash2, Plus,
  Save, RefreshCw, Settings, Package, Target, TrendingUp, AlertCircle,
  CheckCircle, X, ArrowUp, ArrowDown, Copy, Shuffle
} from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import toast from 'react-hot-toast';
import smartTripPlannerService from '../services/smartTripPlannerService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SmartTripPlannerPage = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: AI Suggestions, 3: Customization
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
    interests: [],
    travelStyle: 'moderate',
    accommodation: 'hotel',
    transport: 'mixed',
    mealPreference: 'mixed',
    activityLevel: 'moderate'
  });

  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [customItinerary, setCustomItinerary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [budgetBreakdown, setBudgetBreakdown] = useState(null);
  const [alternativeOptions, setAlternativeOptions] = useState({});

  const interestOptions = [
    { id: 'adventure', label: 'Adventure', icon: '🏔️', color: 'orange' },
    { id: 'culture', label: 'Culture', icon: '🏛️', color: 'purple' },
    { id: 'food', label: 'Food', icon: '🍜', color: 'red' },
    { id: 'nature', label: 'Nature', icon: '🌿', color: 'green' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️', color: 'pink' },
    { id: 'nightlife', label: 'Nightlife', icon: '🌃', color: 'blue' },
    { id: 'history', label: 'History', icon: '📚', color: 'yellow' },
    { id: 'beach', label: 'Beach', icon: '🏖️', color: 'cyan' },
    { id: 'wellness', label: 'Wellness', icon: '🧘', color: 'indigo' },
    { id: 'photography', label: 'Photography', icon: '📸', color: 'gray' }
  ];

  const travelStyles = [
    { id: 'budget', label: 'Budget Traveler', desc: 'Hostels, local transport, street food' },
    { id: 'moderate', label: 'Moderate', desc: 'Mid-range hotels, mix of transport, good restaurants' },
    { id: 'luxury', label: 'Luxury', desc: 'Premium hotels, private transport, fine dining' },
    { id: 'backpacker', label: 'Backpacker', desc: 'Minimal cost, maximum experience' }
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

  const generateAISuggestions = async (e) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget || formData.interests.length === 0) {
      toast.error('Please fill all required fields and select at least one interest');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await smartTripPlannerService.generateSmartItinerary(formData);
      setAiSuggestions(response);
      setCustomItinerary(JSON.parse(JSON.stringify(response))); // Deep copy for customization
      setBudgetBreakdown(response.budgetBreakdown);
      setStep(2);
      toast.success('AI suggestions generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeBudget = async () => {
    setIsOptimizing(true);
    try {
      const optimizedData = await smartTripPlannerService.optimizeBudget({
        itinerary: customItinerary,
        targetBudget: formData.budget,
        priorities: formData.interests
      });
      setCustomItinerary(optimizedData.itinerary);
      setBudgetBreakdown(optimizedData.budgetBreakdown);
      toast.success('Budget optimized successfully!');
    } catch (error) {
      toast.error('Failed to optimize budget');
    } finally {
      setIsOptimizing(false);
    }
  };

  const addCustomActivity = (dayIndex) => {
    const newActivity = {
      id: Date.now(),
      time: '12:00 PM',
      activity: 'Custom Activity',
      location: 'To be decided',
      duration: '2 hours',
      cost: 0,
      type: 'custom',
      ecoFriendly: false,
      editable: true
    };

    const updatedItinerary = { ...customItinerary };
    updatedItinerary.days[dayIndex].activities.push(newActivity);
    setCustomItinerary(updatedItinerary);
  };

  const updateActivity = (dayIndex, activityIndex, field, value) => {
    const updatedItinerary = { ...customItinerary };
    updatedItinerary.days[dayIndex].activities[activityIndex][field] = value;
    setCustomItinerary(updatedItinerary);
    
    // Recalculate budget if cost changed
    if (field === 'cost') {
      recalculateBudget();
    }
  };

  const removeActivity = (dayIndex, activityIndex) => {
    const updatedItinerary = { ...customItinerary };
    updatedItinerary.days[dayIndex].activities.splice(activityIndex, 1);
    setCustomItinerary(updatedItinerary);
    recalculateBudget();
  };

  const moveActivity = (dayIndex, activityIndex, direction) => {
    const updatedItinerary = { ...customItinerary };
    const activities = updatedItinerary.days[dayIndex].activities;
    const newIndex = direction === 'up' ? activityIndex - 1 : activityIndex + 1;
    
    if (newIndex >= 0 && newIndex < activities.length) {
      [activities[activityIndex], activities[newIndex]] = [activities[newIndex], activities[activityIndex]];
      setCustomItinerary(updatedItinerary);
    }
  };

  const recalculateBudget = () => {
    if (!customItinerary) return;
    
    let totalCost = 0;
    customItinerary.days.forEach(day => {
      day.activities.forEach(activity => {
        totalCost += activity.cost || 0;
      });
    });

    const newBreakdown = {
      activities: totalCost,
      accommodation: budgetBreakdown?.accommodation || 0,
      transport: budgetBreakdown?.transport || 0,
      food: budgetBreakdown?.food || 0,
      total: totalCost + (budgetBreakdown?.accommodation || 0) + (budgetBreakdown?.transport || 0) + (budgetBreakdown?.food || 0)
    };

    setBudgetBreakdown(newBreakdown);
  };

  const getAlternativeOptions = async (activity) => {
    try {
      const alternatives = await smartTripPlannerService.getAlternatives({
        activity: activity.activity,
        location: formData.destination,
        budget: activity.cost,
        interests: formData.interests
      });
      setAlternativeOptions(prev => ({
        ...prev,
        [activity.id]: alternatives
      }));
    } catch (error) {
      toast.error('Failed to load alternatives');
    }
  };

  const downloadCustomPDF = async () => {
    // Similar to the original PDF download but with custom itinerary
    try {
      const element = document.getElementById('custom-itinerary');
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `TravelSmart_Custom_${formData.destination.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      toast.success('Custom itinerary downloaded!');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const saveItinerary = async () => {
    try {
      await smartTripPlannerService.saveCustomItinerary({
        ...customItinerary,
        formData,
        budgetBreakdown
      });
      toast.success('Itinerary saved to your account!');
    } catch (error) {
      toast.error('Failed to save itinerary');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Smart Trip Planner
          </h1>
          <p className="text-gray-600 text-lg">
            AI-Powered • Fully Customizable • Budget Optimized • Real-time Updates
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNum ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Enhanced Form */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-purple-600" />
                Trip Preferences
              </h2>

              <form onSubmit={generateAISuggestions} className="space-y-6">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Destination *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="e.g., Paris, Tokyo, Bali"
                        required
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Travelers *
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date *
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
                      End Date *
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

                {/* Budget */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Budget (₹) *
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

                {/* Travel Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Travel Style
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {travelStyles.map(style => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setFormData({...formData, travelStyle: style.id})}
                        className={`p-4 rounded-xl border-2 text-left transition ${
                          formData.travelStyle === style.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{style.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Interests *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {interestOptions.map(interest => (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`px-4 py-3 rounded-xl font-medium transition text-sm ${
                          formData.interests.includes(interest.id)
                            ? `bg-${interest.color}-100 text-${interest.color}-700 border-2 border-${interest.color}-300`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                        }`}
                      >
                        <div className="text-lg mb-1">{interest.icon}</div>
                        {interest.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Accommodation
                    </label>
                    <select
                      name="accommodation"
                      value={formData.accommodation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="hostel">Hostels</option>
                      <option value="hotel">Hotels</option>
                      <option value="luxury">Luxury Hotels</option>
                      <option value="airbnb">Airbnb/Homestay</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Transport
                    </label>
                    <select
                      name="transport"
                      value={formData.transport}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="public">Public Transport</option>
                      <option value="private">Private Car/Taxi</option>
                      <option value="rental">Car Rental</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Activity Level
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="relaxed">Relaxed</option>
                      <option value="moderate">Moderate</option>
                      <option value="active">Very Active</option>
                    </select>
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
                      Generating AI Suggestions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Generate Smart Suggestions
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 2: AI Suggestions Review */}
        {step === 2 && aiSuggestions && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  AI Generated Suggestions
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Back to Form
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Customize Trip
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{aiSuggestions.days?.length || 0}</div>
                  <div className="text-sm text-blue-700">Days</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">₹{aiSuggestions.estimatedBudget?.total || 0}</div>
                  <div className="text-sm text-green-700">Total Cost</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{aiSuggestions.carbonFootprint?.total || 0} kg</div>
                  <div className="text-sm text-orange-700">CO₂ Footprint</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {aiSuggestions.days?.reduce((acc, day) => acc + (day.activities?.length || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-purple-700">Activities</div>
                </div>
              </div>

              {/* Preview Itinerary */}
              <div className="space-y-4">
                {aiSuggestions.days?.map((day, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-3">
                      Day {day.day}: {day.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {day.activities?.slice(0, 3).map((activity, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3">
                          <div className="font-semibold text-sm text-gray-900">{activity.activity}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {activity.time} • ₹{activity.cost}
                          </div>
                        </div>
                      ))}
                      {day.activities?.length > 3 && (
                        <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center">
                          <span className="text-sm text-gray-600">
                            +{day.activities.length - 3} more activities
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Customization Interface */}
        {step === 3 && customItinerary && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl shadow-xl p-4 sticky top-4">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Trip Controls</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={optimizeBudget}
                    disabled={isOptimizing}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isOptimizing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Target className="w-4 h-4" />
                    )}
                    Optimize Budget
                  </button>

                  <button
                    onClick={saveItinerary}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Itinerary
                  </button>

                  <button
                    onClick={downloadCustomPDF}
                    className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>

                {/* Budget Summary */}
                {budgetBreakdown && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Budget Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Activities:</span>
                        <span>₹{budgetBreakdown.activities}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accommodation:</span>
                        <span>₹{budgetBreakdown.accommodation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transport:</span>
                        <span>₹{budgetBreakdown.transport}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span className={budgetBreakdown.total > formData.budget ? 'text-red-600' : 'text-green-600'}>
                          ₹{budgetBreakdown.total}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Budget: ₹{formData.budget}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content - Editable Itinerary */}
            <div className="lg:col-span-3">
              <div id="custom-itinerary" className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Edit3 className="w-6 h-6 text-purple-600" />
                    Customize Your Trip
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back to Suggestions
                    </button>
                  </div>
                </div>

                {/* Day Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b">
                  {customItinerary.days?.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`px-4 py-2 rounded-t-lg font-medium transition ${
                        selectedDay === index
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Day {day.day}
                    </button>
                  ))}
                </div>

                {/* Selected Day Content */}
                {customItinerary.days?.[selectedDay] && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">
                        Day {customItinerary.days[selectedDay].day}: {customItinerary.days[selectedDay].title}
                      </h3>
                      <button
                        onClick={() => addCustomActivity(selectedDay)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Activity
                      </button>
                    </div>

                    {/* Activities List */}
                    <div className="space-y-3">
                      {customItinerary.days[selectedDay].activities?.map((activity, activityIndex) => (
                        <div key={activity.id || activityIndex} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Time</label>
                                <input
                                  type="text"
                                  value={activity.time}
                                  onChange={(e) => updateActivity(selectedDay, activityIndex, 'time', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Activity</label>
                                <input
                                  type="text"
                                  value={activity.activity}
                                  onChange={(e) => updateActivity(selectedDay, activityIndex, 'activity', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Cost (₹)</label>
                                <input
                                  type="number"
                                  value={activity.cost}
                                  onChange={(e) => updateActivity(selectedDay, activityIndex, 'cost', parseInt(e.target.value) || 0)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                            </div>

                            {/* Activity Controls */}
                            <div className="flex flex-col gap-1 ml-4">
                              <button
                                onClick={() => moveActivity(selectedDay, activityIndex, 'up')}
                                disabled={activityIndex === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveActivity(selectedDay, activityIndex, 'down')}
                                disabled={activityIndex === customItinerary.days[selectedDay].activities.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => getAlternativeOptions(activity)}
                                className="p-1 text-blue-400 hover:text-blue-600"
                              >
                                <Shuffle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeActivity(selectedDay, activityIndex)}
                                className="p-1 text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Additional Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Location</label>
                              <input
                                type="text"
                                value={activity.location}
                                onChange={(e) => updateActivity(selectedDay, activityIndex, 'location', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Duration</label>
                              <input
                                type="text"
                                value={activity.duration}
                                onChange={(e) => updateActivity(selectedDay, activityIndex, 'duration', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={activity.ecoFriendly}
                                  onChange={(e) => updateActivity(selectedDay, activityIndex, 'ecoFriendly', e.target.checked)}
                                  className="rounded"
                                />
                                <Leaf className="w-4 h-4 text-green-600" />
                                Eco-friendly
                              </label>
                            </div>
                          </div>

                          {/* Alternative Options */}
                          {alternativeOptions[activity.id] && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <h5 className="font-semibold text-sm text-blue-900 mb-2">Alternative Options:</h5>
                              <div className="space-y-2">
                                {alternativeOptions[activity.id].map((alt, altIndex) => (
                                  <button
                                    key={altIndex}
                                    onClick={() => {
                                      updateActivity(selectedDay, activityIndex, 'activity', alt.name);
                                      updateActivity(selectedDay, activityIndex, 'cost', alt.cost);
                                    }}
                                    className="block w-full text-left p-2 bg-white rounded border hover:bg-blue-50 text-sm"
                                  >
                                    <div className="font-medium">{alt.name}</div>
                                    <div className="text-gray-600">₹{alt.cost} • {alt.duration}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartTripPlannerPage;