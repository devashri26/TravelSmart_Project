import { useState } from "react";
  import { MapPin, Calendar, DollarSign, Sparkles, Loader2, Download, Leaf, Phone, Hospital, Shield, Clock, Users } from "lucide-react";
  import Navbar from "../components/Layout/Navbar";
  import toast from "react-hot-toast";
  import tripPlannerService from "../services/tripPlannerService";
 
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
 
            <div className="lg:col-span-3 space-y-6">
              {itinerary ? (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">       
                    <Calendar className="w-6 h-6 text-purple-600" />
                    Your Personalized Itinerary
                  </h2>
 
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
                                <span className="text-sm font-bold text-purple-600">
                                  {activity.time}
                                </span>
                                <p className="font-semibold text-gray-900">{activity.activity}</p>     
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <span>{activity.location}</span>
                                  <span>{activity.duration}</span>
                                  <span>₹{activity.cost}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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