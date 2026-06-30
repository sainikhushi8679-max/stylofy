import React, { useState, useEffect } from "react";
import AppHeader from "./components/AppHeader";
import OnboardingForm from "./components/OnboardingForm";
import ColorPalette from "./components/ColorPalette";
import RecommendationsList from "./components/RecommendationsList";
import SavedLooks from "./components/SavedLooks";
import StyleGuide from "./components/StyleGuide";
import AdminPanel from "./components/AdminPanel";
import { UserProfile, RecommendationResponse, SavedOutfit, Outfit } from "./types";
import { Sparkles, RefreshCw, AlertCircle, Compass, Shirt, Heart, Info, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"stylist" | "saved" | "guide" | "admin">("stylist");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Wardrobe / Saved Outfits persistence in LocalStorage
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(() => {
    try {
      const stored = localStorage.getItem("stylofy_saved_outfits");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load user profile and previous recommendations if they exist
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("stylofy_user_profile");
      const storedRecs = localStorage.getItem("stylofy_user_recommendations");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
      if (storedRecs) {
        setRecommendations(JSON.parse(storedRecs));
      }
    } catch (err) {
      console.error("Failed to restore previous session:", err);
    }
  }, []);

  // Save Outfits to LocalStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("stylofy_saved_outfits", JSON.stringify(savedOutfits));
    } catch (err) {
      console.error("Failed to persist saved outfits:", err);
    }
  }, [savedOutfits]);

  const handleOnboardingSubmit = async (selectedProfile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setProfile(selectedProfile);

    // Save profile to local storage immediately
    try {
      localStorage.setItem("stylofy_user_profile", JSON.stringify(selectedProfile));
    } catch (err) {
      console.error("Local storage error:", err);
    }

    try {
      const response = await fetch("/api/stylist/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedProfile)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate your personalized styling recommendations. Please check your network connection or try again.");
      }

      const data: RecommendationResponse = await response.json();
      setRecommendations(data);
      
      // Save recommendations in local storage
      try {
        localStorage.setItem("stylofy_user_recommendations", JSON.stringify(data));
      } catch (err) {
        console.error("Local storage error:", err);
      }
    } catch (err: any) {
      console.error("Styling recommendation failure:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetakeForm = () => {
    // Keep saved outfits, but clear profile & current recommendations
    setProfile(null);
    setRecommendations(null);
    setError(null);
    try {
      localStorage.removeItem("stylofy_user_profile");
      localStorage.removeItem("stylofy_user_recommendations");
    } catch (err) {
      console.error("Local storage error:", err);
    }
  };

  const handleSaveOutfit = (outfit: Outfit) => {
    if (!profile) return;

    setSavedOutfits(prev => {
      // Check if already saved
      const exists = prev.some(item => item.id === outfit.id);
      if (exists) {
        // Remove it (toggle save behavior)
        return prev.filter(item => item.id !== outfit.id);
      } else {
        // Add it
        const newSave: SavedOutfit = {
          id: outfit.id,
          outfit,
          profile: { ...profile },
          savedAt: new Date().toISOString(),
          liked: true
        };
        return [newSave, ...prev];
      }
    });
  };

  const handleDeleteOutfit = (id: string) => {
    setSavedOutfits(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setSavedOutfits(prev => 
      prev.map(item => item.id === id ? { ...item, notes } : item)
    );
  };

  const savedOutfitIds = savedOutfits.map(o => o.id);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col font-sans" id="stylofy-app-root">
      
      {/* Premium Header */}
      <AppHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        savedCount={savedOutfits.length} 
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12" id="main-content-area">
        
        {activeTab === "stylist" && (
          <div className="space-y-10" id="stylist-tab-container">
            
            {/* If no profile has been set, show Onboarding Form */}
            {!profile && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                {/* Visual Intro Banner */}
                <div className="text-center space-y-3 max-w-2xl mx-auto mb-6">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1 border-2 border-black bg-black text-white text-[10px] font-extrabold uppercase tracking-widest mb-2 rounded-none">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI-Powered Wardrobe Co-Pilot
                  </div>
                  <h1 className="font-serif font-black text-3xl sm:text-5xl tracking-tight text-black leading-none uppercase italic">
                    Discover Clothes & Accessories That Actually Suit You
                  </h1>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    Stylofy analyzes your natural attributes—vein colors, skin undertones, face architecture, and body silhouettes—to customize outfits that make you look flawless.
                  </p>
                </div>

                <OnboardingForm onSubmit={handleOnboardingSubmit} isLoading={isLoading} />
              </motion.div>
            )}

            {/* If currently calling Gemini API */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 max-w-md mx-auto" id="loading-fallback">
                <div className="relative">
                  {/* Styling loop spinner */}
                  <div className="w-20 h-20 rounded-none border-4 border-black border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shirt className="w-8 h-8 text-black animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-black text-black uppercase italic">Consulting AI Stylist...</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Stylofy is mapping your custom color spectrum, evaluating your silhouette ratios, and curating real product listings from Myntra, Amazon, Flipkart, and Savana. This takes just a moment!
                  </p>
                </div>
                {/* Faux progress indicators */}
                <div className="bg-white border border-black px-4 py-2.5 rounded-none w-full flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-none bg-black animate-ping"></span>
                  <span className="text-[10px] font-mono text-gray-700 uppercase tracking-widest font-extrabold">
                    Synthesizing bespoke color palettes...
                  </span>
                </div>
              </div>
            )}

            {/* Error view */}
            {error && !isLoading && (
              <div className="max-w-2xl mx-auto bg-rose-50 rounded-none border-2 border-red-900 p-8 text-center space-y-6" id="error-fallback">
                <div className="bg-rose-100 w-14 h-14 rounded-none border border-red-900 flex items-center justify-center mx-auto text-red-700">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-black text-black uppercase italic">Styling Engine Interrupted</h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-md mx-auto">
                    {error}
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (profile) handleOnboardingSubmit(profile);
                    }}
                    className="bg-black hover:bg-gray-950 text-white px-5 py-2.5 rounded-none text-xs font-extrabold uppercase tracking-widest flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Generation
                  </button>
                  <button
                    onClick={handleRetakeForm}
                    className="bg-white hover:bg-gray-50 text-black border-2 border-black px-5 py-2.5 rounded-none text-xs font-extrabold uppercase tracking-widest"
                  >
                    Retake Attributes
                  </button>
                </div>
              </div>
            )}

            {/* Display Recommendations & Palette once generated */}
            {profile && recommendations && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
                id="results-viewport"
              >
                {/* Small stats header detailing current attributes used */}
                <div className="bg-white border-2 border-black rounded-none p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2.5 rounded-none border border-black text-black">
                      <Shirt className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-extrabold text-black uppercase tracking-widest">ACTIVE STYLING PROFILE</h4>
                      <p className="text-xs text-gray-700 mt-0.5 leading-snug">
                        {profile.gender} • {profile.bodyShape} Body • {profile.skinTone} Tone • Occasion: <span className="text-black font-extrabold uppercase">{profile.occasion}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleRetakeForm}
                    className="text-xs font-extrabold uppercase tracking-widest text-black bg-white hover:bg-gray-100 border-2 border-black px-4 py-2.5 rounded-none flex items-center gap-1.5 transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Change Attributes
                  </button>
                </div>

                {/* Palette */}
                <ColorPalette colorAnalysis={recommendations.colorAnalysis} />

                {/* Outfit Recommendations */}
                <RecommendationsList 
                  outfits={recommendations.outfits} 
                  profile={profile} 
                  onSaveOutfit={handleSaveOutfit} 
                  savedOutfitIds={savedOutfitIds} 
                />

              </motion.div>
            )}

          </div>
        )}

        {activeTab === "saved" && (
          <SavedLooks 
            savedOutfits={savedOutfits} 
            onDeleteOutfit={handleDeleteOutfit} 
            onUpdateNotes={handleUpdateNotes} 
          />
        )}

        {activeTab === "guide" && (
          <StyleGuide />
        )}

        {activeTab === "admin" && (
          <AdminPanel />
        )}

      </main>

      {/* Footer copyright */}
      <footer className="border-t-2 border-black bg-white py-8 text-center" id="global-footer">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          &copy; {new Date().getFullYear()} STYLOFY INC. • INTUITIVE PERSONAL AI FASHION STYLIST • POWERED BY GEMINI 2.5 FLASH
        </p>
      </footer>

    </div>
  );
}
