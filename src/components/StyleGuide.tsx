import React, { useState } from "react";
import { 
  Palette, 
  Check, 
  X, 
  Info 
} from "lucide-react";

export default function StyleGuide() {
  const [activeSubTab, setActiveSubTab] = useState<"colors" | "bodies" | "faces" >("colors");

  const colorGuides = [
    {
      type: "Warm Undertone (Autumn / Spring)",
      veins: "Green veins, golden/yellow skin reflex",
      metals: "Yellow Gold, Rose Gold, Warm Brass",
      palette: ["Terracotta", "Mustard Yellow", "Warm Olive", "Creamy Ivory", "Burnt Orange"],
      wear: "Warm colors with a yellow undertone. Think autumn leaves and earth shades.",
      avoid: "Icy blues, bright magenta, or steel grey which make you look washed out."
    },
    {
      type: "Cool Undertone (Summer / Winter)",
      veins: "Blue or purple veins, pink/red skin reflex",
      metals: "Sterling Silver, Platinum, White Gold",
      palette: ["Classic Navy", "Emerald Green", "Royal Purple", "Pure White", "Dusty Pink"],
      wear: "Cool colors with blue undertones. Think deep sea shades, snow landscapes, and primary jewel tones.",
      avoid: "Bright orange, warm yellows, and brownish ivory which clash with your natural skin balance."
    },
    {
      type: "Neutral Undertone (All Seasons)",
      veins: "Mix of blue and green, skin reflex is balanced",
      metals: "Both Gold and Silver look equally majestic",
      palette: ["Soft Teal", "Taupe / Sand", "Dusty Rose", "Sage Green", "Charcoal Grey"],
      wear: "Muted, medium shades that aren't overly saturated warm or cold. Soft pastels and dusty tones are your superpower.",
      avoid: "None really! But stay cautious of super saturated neon greens or stark yellows."
    }
  ];

  const bodyGuides = [
    {
      shape: "Hourglass",
      ratio: "Bust and hips are of equal width, waist is narrow and highly defined.",
      wear: "Fitted wrap dresses, high-waisted trousers, belted coats, crop tops, V-neck, and sweetheart necklines.",
      avoid: "Oversized shapeless sacks, heavy ruffles on both bust and hips which add bulk.",
      illustration: "⏳"
    },
    {
      shape: "Pear (Triangle)",
      ratio: "Hips are significantly wider than shoulders and bust. Delicate upper torso.",
      wear: "Boat necklines, puffed sleeves, structured blazers, A-line skirts, wide-leg dark pants.",
      avoid: "Skinny jeans, heavy detailing or bright patterns on hips/pockets, tight tube skirts.",
      illustration: "🍐"
    },
    {
      shape: "Apple (Round)",
      ratio: "Upper body is heavier, carrying weight primarily in midsection, with gorgeous legs.",
      wear: "Flowy empire-line waist silhouettes, shift dresses, tunic tops, structured cardigans, V-necks.",
      avoid: "Clinging fabrics, horizontal striped shirts, thick belts wrapped around your stomach.",
      illustration: "🍎"
    },
    {
      shape: "Rectangle / Ruler",
      ratio: "Bust, waist, and hips are of similar widths, creating a straight athletic frame.",
      wear: "High-rise belts, ruffled collars, pleated skirts, fit-and-flare dresses, padded jackets.",
      avoid: "Boxy, completely straight garments, vertical stripes that elongate without curving.",
      illustration: "🧱"
    },
    {
      shape: "Inverted Triangle",
      ratio: "Shoulders and bust are noticeably wider than hips. Strong, active posture.",
      wear: "Wide-leg pants, cargo bottoms, peplum tops, V-necks, raglan sleeves, flared dresses.",
      avoid: "Padded shoulders, boat necklines, skinny jeans which emphasize shoulder-hip contrast.",
      illustration: "📐"
    }
  ];

  const faceGuides = [
    {
      shape: "Round",
      desc: "Soft features, length and width are almost equal.",
      earrings: "Long dangles, threaders, geometric drop earrings.",
      necks: "Deep V-necks, scoop necks, sweetheart collar lines.",
      avoid: "Stark round hoops, chunky circular studs, high turtlenecks."
    },
    {
      shape: "Oval",
      desc: "Highly balanced, slightly tapering forehead and jaw.",
      earrings: "Universal! Large hoops, statement drops, delicate studs.",
      necks: "Crew necks, boat necks, square necklines look superb.",
      avoid: "Extremely long thin drops that drag your natural balance down."
    },
    {
      shape: "Square",
      desc: "Angular jawline and hairline of equal width.",
      earrings: "Rounded hoops, curves, medium-length teardrops.",
      necks: "Cowls, sweetheart, off-shoulder necklines.",
      avoid: "Sharp square studs, harsh rectangular earrings, stark square necklines."
    },
    {
      shape: "Heart",
      desc: "Wide forehead and cheekbones tapering to a fine chin.",
      earrings: "Chandelier styles, teardrops, wider bases.",
      necks: "Boat necks, crew necks, horizontal neck cuts.",
      avoid: "Short top-heavy studs, V-necks which point downwards."
    },
    {
      shape: "Diamond",
      desc: "Widest at cheekbones, narrow forehead and chin.",
      earrings: "Sleek small hoops, short drops, elegant bars.",
      necks: "Mandarin collars, collared shirts, high necks.",
      avoid: "Very wide drop earrings which compete with wide cheekbones."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8" id="style-guide-viewport">
      {/* Intro Header */}
      <div className="text-center sm:text-left space-y-2">
        <h2 className="font-serif text-3xl font-black text-black tracking-tight flex items-center justify-center sm:justify-start gap-2 uppercase italic">
          <Palette className="text-black" />
          STYLOFY Style Academy
        </h2>
        <p className="text-sm text-gray-700 max-w-2xl leading-relaxed">
          Master the rules of proportion, color harmonizing, and facial geometry used by top-tier stylists. Learn how our AI calculates your personalized styling palettes and fits.
        </p>
      </div>

      {/* Guide Navigation */}
      <div className="flex border-b-2 border-black gap-6 sm:gap-10 overflow-x-auto pb-0.5" id="academy-tabs">
        <button
          onClick={() => setActiveSubTab("colors")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all duration-200 whitespace-nowrap ${
            activeSubTab === "colors"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          Color Science (Undertones)
        </button>
        <button
          onClick={() => setActiveSubTab("bodies")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all duration-200 whitespace-nowrap ${
            activeSubTab === "bodies"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          Body Geometry (Silhouettes)
        </button>
        <button
          onClick={() => setActiveSubTab("faces")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-widest border-b-2 transition-all duration-200 whitespace-nowrap ${
            activeSubTab === "faces"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          Face Architecture (Accessorizing)
        </button>
      </div>

      {/* GUIDE SUBTAB CONTROLLER */}
      {activeSubTab === "colors" && (
        <div className="space-y-6" id="guide-color-science">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {colorGuides.map((guide, i) => (
              <div 
                key={guide.type}
                className="bg-white border-2 border-black rounded-none p-5 space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-none" style={{
                      backgroundColor: i === 0 ? "#D29063" : i === 1 ? "#3b82f6" : "#10b981"
                    }}></span>
                    <h3 className="font-serif font-extrabold text-base text-black uppercase tracking-tight italic">
                      {guide.type}
                    </h3>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-gray-500 uppercase font-extrabold block">VEIN COLOR CHECK</span>
                    <p className="text-xs text-gray-800 leading-snug">{guide.veins}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-gray-500 uppercase font-extrabold block">RECOMMENDED METALS</span>
                    <p className="text-xs text-black font-extrabold uppercase tracking-wide leading-snug">{guide.metals}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-gray-500 uppercase font-extrabold block">BEST COLORS</span>
                    <p className="text-xs text-gray-700 leading-relaxed">{guide.wear}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-gray-500 uppercase font-extrabold block">COLORS TO AVOID</span>
                    <p className="text-xs text-rose-700 font-bold leading-relaxed">{guide.avoid}</p>
                  </div>
                </div>

                {/* mini palette visualization */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <span className="text-[9px] font-mono text-gray-500 uppercase font-extrabold block">SAMPLE PALETTE SHADES</span>
                  <div className="flex gap-1.5">
                    {guide.palette.map((colorName, idx) => (
                      <span 
                        key={colorName}
                        title={colorName}
                        className="w-6 h-6 rounded-none border border-black/30 shadow-inner flex-shrink-0 cursor-help"
                        style={{
                          backgroundColor: 
                            guide.type.includes("Warm")
                              ? ["#b45309", "#d97706", "#15803d", "#fef3c7", "#ea580c"][idx]
                              : guide.type.includes("Cool")
                              ? ["#1d4ed8", "#047857", "#6d28d9", "#ffffff", "#ec4899"][idx]
                              : ["#0f766e", "#78716c", "#fda4af", "#15803d", "#374151"][idx]
                        }}
                      ></span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="bg-[#FAF9F6] border border-black rounded-none p-5 flex items-start gap-3.5">
            <div className="bg-black p-2.5 rounded-none text-white">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-black">Pro Tip: Lighting is Everything!</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                When inspecting your skin tone and veins, stand under soft natural day lighting. Incandescent indoor light bulbs have strong yellow frequencies which can trick you into thinking your skin undertone is warmer than it actually is!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "bodies" && (
        <div className="space-y-6" id="guide-body-geometry">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bodyGuides.map((guide) => (
              <div 
                key={guide.shape}
                className="bg-white border-2 border-black rounded-none p-6 space-y-4 shadow-sm flex gap-4"
              >
                {/* Silhouette avatar */}
                <div className="bg-[#FAF9F6] w-14 h-14 rounded-none border border-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                  {guide.illustration}
                </div>

                <div className="space-y-3 flex-grow">
                  <div className="space-y-0.5">
                    <h3 className="font-serif font-black text-lg text-black uppercase italic">
                      {guide.shape} Shape
                    </h3>
                    <p className="text-xs text-gray-600 leading-normal">{guide.ratio}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                        <Check className="w-3.5 h-3.5" />
                        Best Fits
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{guide.wear}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-rose-800 uppercase tracking-wider">
                        <X className="w-3.5 h-3.5" />
                        To Avoid
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{guide.avoid}</p>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "faces" && (
        <div className="space-y-6" id="guide-face-architecture">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faceGuides.map((guide) => (
              <div 
                key={guide.shape}
                className="bg-white border-2 border-black rounded-none p-5 space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <h3 className="font-serif font-black text-lg text-black uppercase italic">
                    {guide.shape}
                  </h3>
                  <p className="text-xs text-gray-600 leading-snug">{guide.desc}</p>
                  
                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <div className="text-[10px] uppercase font-extrabold text-black tracking-wider">
                      ✨ EAR JEWELRY RULES
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{guide.earrings}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <div className="text-[10px] uppercase font-extrabold text-black tracking-wider">
                      👕 OPTIMAL NECK CUTS
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{guide.necks}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 text-[10px] text-rose-800 font-bold leading-relaxed italic">
                  Avoid: {guide.avoid}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

