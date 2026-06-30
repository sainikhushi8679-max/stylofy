import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Eye, 
  Sparkle, 
  Smile, 
  Calendar, 
  Check, 
  HelpCircle 
} from "lucide-react";
import { motion } from "motion/react";

interface OnboardingFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
  initialProfile?: UserProfile;
}

export default function OnboardingForm({ onSubmit, isLoading, initialProfile }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      gender: "",
      skinTone: "",
      undertone: "",
      veinShade: "",
      bodyShape: "",
      faceShape: "",
      occasion: ""
    }
  );

  const [hoveredShape, setHoveredShape] = useState<string | null>(null);

  const updateField = (field: keyof UserProfile, value: string) => {
    setProfile(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-infer undertone from vein shade if vein shade changes
      if (field === "veinShade") {
        if (value === "Blue/Purple") {
          updated.undertone = "Cool";
        } else if (value === "Green") {
          updated.undertone = "Warm";
        } else if (value === "Mix of Blue and Green") {
          updated.undertone = "Neutral";
        }
      }
      return updated;
    });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!profile.gender;
      case 2:
        return !!profile.skinTone && !!profile.veinShade;
      case 3:
        return !!profile.bodyShape;
      case 4:
        return !!profile.faceShape;
      case 5:
        return !!profile.occasion;
      default:
        return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStepValid()) {
      onSubmit(profile);
    }
  };

  // Helper arrays for options
  const genders = [
    { value: "Men", label: "Men's Styling", desc: "Suits, blazers, sneakers, loafters, casuals & ethnics", icon: "🤵" },
    { value: "Women", label: "Women's Styling", desc: "Dresses, sarees, accessories, heels, ethnic & casuals", icon: "👗" }
  ];

  const skinTones = [
    { value: "Light", label: "Fair / Light", hex: "#FAD8C3", desc: "Burns easily, porcelain/ivory tone" },
    { value: "Medium", label: "Medium", hex: "#E9B38F", desc: "Tans gently, olive or warm beige" },
    { value: "Tan", label: "Tan / Wheatish", hex: "#D29063", desc: "Rarely burns, rich golden-brown" },
    { value: "Deep", label: "Deep / Rich", hex: "#7E4E2C", desc: "Deep chocolate or espresso undertones" }
  ];

  const veinShades = [
    { value: "Blue/Purple", label: "Blue / Purple Veins", undertone: "Cool Undertone", desc: "Silver jewelry matches you best. You look stunning in blues, purples, and jewel tones." },
    { value: "Green", label: "Green / Olive Veins", undertone: "Warm Undertone", desc: "Gold jewelry matches you best. You look amazing in reds, oranges, yellows, and warm earth tones." },
    { value: "Mix of Blue and Green", label: "Mix of Blue & Green", undertone: "Neutral Undertone", desc: "Both gold and silver look wonderful. You can pull off almost any color with ease." }
  ];

  const bodyShapes = [
    { value: "Hourglass", label: "Hourglass", desc: "Bust and hips are balanced with a narrower, defined waistline.", tip: "Highlight your waist! Fitted styles and wrap dresses look magnificent." },
    { value: "Pear", label: "Pear", desc: "Your hips and thighs are wider than your shoulders and bust.", tip: "Draw attention upwards with structured shoulders, wide necklines, and colorful tops." },
    { value: "Apple", label: "Apple", desc: "Upper body is heavier, with a full midsection and slender limbs.", tip: "Flowy empire waist silhouettes, V-necks, and structured jackets work wonders." },
    { value: "Rectangle", label: "Rectangle / Banana", desc: "Bust, waist, and hips are of relatively similar width.", tip: "Create curves! High-waisted pants, ruffles, belts, and fitted blazers are great." },
    { value: "Athletic", label: "Athletic / Muscular", desc: "Broad shoulders, toned build, with balanced hips.", tip: "Showcase your shoulders! Halter necks, racerbacks, and flowy skirts add elegant rhythm." },
    { value: "Inverted Triangle", label: "Inverted Triangle", desc: "Shoulders or bust are noticeably broader than the hips.", tip: "Balance your lower half with wide-leg trousers, A-line skirts, and peplum tops." }
  ];

  const faceShapes = [
    { value: "Round", label: "Round Face", desc: "Soft curves, wide cheekbones, equal length and width.", accessories: "Long dangling earrings, V-neck tops, aviators or rectangular specs." },
    { value: "Oval", label: "Oval Face", desc: "Gracefully elongated, forehead is slightly wider than jaw.", accessories: "Universal fit! Statement studs, hoops, round or square sunglasses look stellar." },
    { value: "Square", label: "Square Face", desc: "Strong, angular jawline, straight sides, wide forehead.", accessories: "Soft round earrings, hoop styles, oversized curved sunglasses to soften angles." },
    { value: "Heart", label: "Heart Face", desc: "Broad forehead and cheeks tapering down to a pointed chin.", accessories: "Teardrop or chandelier earrings, wider neckline garments, cat-eye frames." },
    { value: "Diamond", label: "Diamond Face", desc: "Widest at cheekbones, narrow forehead and jawline.", accessories: "Short dangling earrings, delicate small hoops, clubmaster or oval specs." }
  ];

  const occasions = [
    { value: "Casual", label: "Casual Everyday Wear", desc: "Comfortable, stylish looks for meetups, weekend trips, and errands." },
    { value: "Office / Professional", label: "Office & Meetings", desc: "Polished corporate, semi-formal, or business casual outfits that command respect." },
    { value: "College / Smart Casual", label: "College / Smart Casual", desc: "Trendy, youthful, relaxed yet incredibly smart clothing." },
    { value: "Party", label: "Party & Clubbing", desc: "Bold, glitzy, eye-catching outfits designed for memorable nights." },
    { value: "Wedding", label: "Wedding Ceremony", desc: "Elegant, sophisticated attire (ethnic or formal) suited for grand celebrations." },
    { value: "Festive", label: "Festive & Cultural Days", desc: "Rich traditional attire, vibrant colors, and classic ethnic accessories." }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-none border-2 border-black p-6 sm:p-10 shadow-lg relative overflow-hidden" id="onboarding-form-container">
      
      {/* Progress Bar Header */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-black flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI STYLING WIZARD
          </span>
          <span className="text-xs font-mono font-bold text-gray-500">Step {step} of 5</span>
        </div>
        <div className="w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" id="styling-onboarding-form">
        
        {/* STEP 1: GENDER */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">
                Welcome. Choose your style genre.
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                We customize the fashion guidelines, wardrobe choices, and jewelry categories based on your preference.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {genders.map((g) => (
                <button
                  type="button"
                  key={g.value}
                  id={`gender-option-${g.value}`}
                  onClick={() => updateField("gender", g.value as any)}
                  className={`flex items-start gap-4 p-6 rounded-none border-2 text-left transition-all duration-300 ${
                    profile.gender === g.value
                      ? "border-black bg-black text-white"
                      : "border-black bg-white hover:bg-gray-50 text-[#1A1A1A]"
                  }`}
                >
                  <span className="text-4xl">{g.icon}</span>
                  <div className="space-y-1">
                    <div className="font-bold flex items-center gap-2">
                      <span className="font-sans text-sm uppercase tracking-wider font-extrabold">{g.label}</span>
                      {profile.gender === g.value && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${profile.gender === g.value ? "text-gray-300" : "text-gray-500"}`}>{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SKIN TONE & UNDERTONE */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">
                Tone & Shade Analysis
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Your skin tone and undertone dictate the seasonal colors that make you glow.
              </p>
            </div>

            {/* Skin Tone Selector */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-extrabold text-black flex items-center gap-2 border-b border-black pb-2">
                1. Select your skin tone depth
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {skinTones.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    id={`skintone-option-${t.value}`}
                    onClick={() => updateField("skinTone", t.value as any)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-none border-2 text-center transition-all duration-300 ${
                      profile.skinTone === t.value
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white hover:border-black text-[#1A1A1A]"
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-none border border-black/20 shadow-inner"
                      style={{ backgroundColor: t.hex }}
                    ></div>
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider">{t.label}</div>
                      <p className={`text-[10px] mt-1 leading-tight ${profile.skinTone === t.value ? "text-gray-400" : "text-gray-500"}`}>{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vein / Undertone Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <h3 className="text-xs uppercase tracking-widest font-extrabold text-black">
                  2. Check your wrist vein color
                </h3>
                <div className="group relative flex items-center gap-1 text-[11px] text-gray-500 cursor-pointer font-bold">
                  <HelpCircle className="w-3.5 h-3.5 text-black" />
                  How to check?
                  <div className="absolute right-0 bottom-6 hidden group-hover:block bg-white text-xs leading-relaxed text-black p-4 rounded-none border-2 border-black w-64 shadow-xl z-50">
                    Look at the veins on your inner wrist in natural daylight. Green suggests Warm; blue or purple indicates Cool; if they are a mix, you are Neutral!
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {veinShades.map((v) => (
                  <button
                    type="button"
                    key={v.value}
                    id={`vein-option-${v.value.replace(/\s+/g, '-')}`}
                    onClick={() => updateField("veinShade", v.value as any)}
                    className={`flex flex-col text-left gap-2.5 p-5 rounded-none border-2 transition-all duration-300 ${
                      profile.veinShade === v.value
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white hover:border-black text-[#1A1A1A]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold uppercase tracking-wider">{v.label}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 ${profile.veinShade === v.value ? "bg-white text-black" : "bg-gray-100 text-gray-800"}`}>
                        {v.value === "Blue/Purple" ? "❄️ Cool" : v.value === "Green" ? "🔥 Warm" : "🌓 Neutral"}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${profile.veinShade === v.value ? "text-gray-300" : "text-gray-500"}`}>{v.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BODY SHAPE */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">
                Define Your Body Architecture
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                We select sleeve styles, trouser cuts, and garment fits that balance your proportions perfectly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {bodyShapes.map((b) => (
                <button
                  type="button"
                  key={b.value}
                  id={`bodyshape-option-${b.value}`}
                  onClick={() => updateField("bodyShape", b.value as any)}
                  onMouseEnter={() => setHoveredShape(b.value)}
                  onMouseLeave={() => setHoveredShape(null)}
                  className={`flex flex-col text-left p-5 rounded-none border-2 transition-all duration-300 relative ${
                    profile.bodyShape === b.value
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white hover:border-black text-[#1A1A1A]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans text-xs uppercase tracking-wider font-extrabold">{b.label}</span>
                    {profile.bodyShape === b.value && (
                      <span className="bg-white rounded-none p-0.5">
                        <Check className="w-3.5 h-3.5 text-black" />
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed flex-grow ${profile.bodyShape === b.value ? "text-gray-300" : "text-gray-500"}`}>{b.desc}</p>
                  
                  <div className={`mt-4 pt-3 border-t text-[11px] italic leading-snug ${profile.bodyShape === b.value ? "border-gray-800 text-gray-300" : "border-gray-100 text-black font-semibold"}`}>
                    {b.tip}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: FACE SHAPE */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">
                Analyze Face Geometry
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Your face shape helps us recommend complementary jewelry styles, sunglasses, necklines, and collar types.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {faceShapes.map((f) => (
                <button
                  type="button"
                  key={f.value}
                  id={`faceshape-option-${f.value}`}
                  onClick={() => updateField("faceShape", f.value as any)}
                  className={`flex flex-col text-left p-4 rounded-none border-2 transition-all duration-300 ${
                    profile.faceShape === f.value
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white hover:border-black text-[#1A1A1A]"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider">{f.label}</span>
                    {profile.faceShape === f.value && (
                      <Check className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <p className={`text-[10px] mb-3 leading-snug flex-grow ${profile.faceShape === f.value ? "text-gray-400" : "text-gray-500"}`}>{f.desc}</p>
                  <div className={`pt-2 border-t text-[10px] ${profile.faceShape === f.value ? "border-gray-800 text-gray-300" : "border-gray-100 text-gray-600"}`}>
                    <span className={`font-bold block mb-0.5 ${profile.faceShape === f.value ? "text-white" : "text-black"}`}>Styling:</span>
                    {f.accessories}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: OCCASION */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">
                Select Your Styling Goal
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Where are you heading? The AI will structure premium styles, accessories, and shoes for this event.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {occasions.map((o) => (
                <button
                  type="button"
                  key={o.value}
                  id={`occasion-option-${o.value.replace(/\s+/g, '-')}`}
                  onClick={() => updateField("occasion", o.value as any)}
                  className={`flex flex-col text-left p-5 rounded-none border-2 transition-all duration-300 relative overflow-hidden group ${
                    profile.occasion === o.value
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white hover:border-black text-[#1A1A1A]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans text-xs uppercase tracking-wider font-extrabold">{o.label}</span>
                    {profile.occasion === o.value && (
                      <span className="bg-white rounded-none p-0.5">
                        <Check className="w-3 h-3 text-black" />
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${profile.occasion === o.value ? "text-gray-300" : "text-gray-500"}`}>{o.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NAVIGATION CONTROLS */}
        <div className="flex justify-between items-center pt-6 border-t border-black" id="form-controls">
          <button
            type="button"
            id="btn-prev"
            onClick={handlePrev}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-extrabold transition-all duration-200 ${
              step === 1
                ? "opacity-30 cursor-not-allowed text-gray-400"
                : "text-black hover:bg-gray-100"
            }`}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              id="btn-next"
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-extrabold rounded-none border-2 transition-all duration-300 ${
                isStepValid()
                  ? "bg-black text-white border-black hover:bg-white hover:text-black active:scale-95"
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              id="btn-submit"
              disabled={!isStepValid() || isLoading}
              className={`flex items-center gap-2.5 px-8 py-3.5 text-xs uppercase tracking-widest font-extrabold rounded-none border-2 transition-all duration-300 ${
                isStepValid() && !isLoading
                  ? "bg-black text-white border-black hover:bg-white hover:text-black active:scale-95"
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Styling Looks...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Styling Look
                </>
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
