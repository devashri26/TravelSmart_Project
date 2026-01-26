import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Layout/Navbar';
import { generateSmartItinerary, optimizeBudget, getAlternatives, saveCustomizedItinerary } from '../services/smartTripPlannerService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SmartTripPlannerPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
    travelStyle: 'comfort',
    accommodationType: 'hotel',
    transportPreference: 'mixed',
    activityLevel: 'medium',
    interests: []
  });
  const [itinerary, setItinerary] = useState(null);
  const [customizedItinerary, setCustomizedItinerary] = useState(null);

  const travelStyles = [
    { id: 'budget', name: 'Budget Explorer', desc: 'Maximum value, authentic experiences', icon: '' },
    { id: 'comfort', name: 'Comfort Traveler', desc: 'Balance of comfort and value', icon: '' },
    { id: 'luxury', name: 'Luxury Experience', desc: 'Premium comfort and exclusive experiences', icon: '' }
  ];

  const interestOptions = [
    { id: 'culture', name: 'Culture & Heritage', icon: '' },
    { id: 'adventure', name: 'Adventure Sports', icon: '' },
    { id: 'food', name: 'Food & Cuisine', icon: '' },
    { id: 'history', name: 'History & Museums', icon: '' },
    { id: 'nature', name: 'Nature & Wildlife', icon: '' },
    { id: 'art', name: 'Art & Galleries', icon: '' },
    { id: 'music', name: 'Music & Festivals', icon: '' },
    { id: 'shopping', name: 'Shopping & Markets', icon: '' },
    { id: 'nightlife', name: 'Nightlife & Entertainment', icon: '' },
    { id: 'wellness', name: 'Wellness & Spa', icon: '' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleGenerateItinerary = async () => {
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.interests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }

    setLoading(true);
    try {
      const result = await generateSmartItinerary(formData);
      setItinerary(result);
      setCustomizedItinerary(result);
      setCurrentStep(2);
      toast.success('Smart itinerary generated successfully!');
    } catch (error) {
      toast.error('Failed to generate itinerary. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('itinerary-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
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

      pdf.save(`Smart-Trip-${formData.destination}-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('Error:', error);
    }
  };

  const renderStep1 = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Smart Trip Planner</h2>
          <p className="text-gray-600">Create your perfect customizable itinerary with AI assistance</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Trip Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Where do you want to go?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹) *</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Total budget"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travelers</label>
                <select
                  value={formData.travelers}
                  onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Travel Preferences</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Travel Style</label>
              <div className="space-y-2">
                {travelStyles.map(style => (
                  <div
                    key={style.id}
                    onClick={() => handleInputChange('travelStyle', style.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.travelStyle === style.id
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{style.icon}</span>
                      <div>
                        <div className="font-medium text-gray-800">{style.name}</div>
                        <div className="text-sm text-gray-600">{style.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Interests *</h3>
          <p className="text-gray-600 mb-4">Select what you're most interested in (choose multiple)</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {interestOptions.map(interest => (
              <div
                key={interest.id}
                onClick={() => handleInterestToggle(interest.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all text-center ${
                  formData.interests.includes(interest.id)
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-2">{interest.icon}</div>
                <div className="text-sm font-medium text-gray-800">{interest.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleGenerateItinerary}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating Smart Itinerary...' : 'Generate Smart Itinerary'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">AI Generated Itinerary</h2>
            <p className="text-gray-600">Review and customize your smart travel plan</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
               Back to Form
            </button>
            <button
              onClick={downloadPDF}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
               Download PDF
            </button>
          </div>
        </div>

        {itinerary && (
          <div id="itinerary-content" className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Overview</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-600">{itinerary.duration}</div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-600">₹{itinerary.budgetBreakdown?.total?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-600">{itinerary.travelers}</div>
                  <div className="text-sm text-gray-600">Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-600">{itinerary.carbonFootprint?.rating}</div>
                  <div className="text-sm text-gray-600">Eco Rating</div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Itinerary</h3>
              <div className="space-y-6">
                {itinerary.days?.map((day, index) => (
                  <div key={index} className="border-l-4 border-cyan-500 pl-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{day.title}</h4>
                    <div className="text-sm text-gray-600 mb-3">
                      Estimated Cost: ₹{day.estimatedCost?.toLocaleString()} | Energy Level: {day.energyLevel}
                    </div>
                    <div className="space-y-3">
                      {day.activities?.map((activity, actIndex) => (
                        <div key={actIndex} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-cyan-600">{activity.time}</span>
                                <span className="text-gray-800">{activity.activity}</span>
                                {activity.ecoFriendly && <span className="text-green-500 text-sm"> Eco-friendly</span>}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                 {activity.location}   {activity.duration}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-800">₹{activity.cost}</div>
                              <div className="text-xs text-gray-500">{activity.category}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step ? 'text-cyan-600 font-medium' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Plan Details' : 'AI Suggestions'}
                </span>
                {step < 2 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    currentStep > step ? 'bg-cyan-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
      </div>
    </div>
  );
};

export default SmartTripPlannerPage;
