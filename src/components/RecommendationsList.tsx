import React, { useState } from "react";
import { Outfit, FashionItem, UserProfile } from "../types";
import { getFashionImage, getBuyNowLink } from "../utils/imageHelper";
import { 
  Heart, 
  Bookmark, 
  ExternalLink, 
  Sparkles, 
  ShoppingBag, 
  Shirt, 
  Sparkle, 
  Compass, 
  Share2,
  Check,
  Layers,
  ArrowRight
} from "lucide-react";

interface RecommendationsListProps {
  outfits: Outfit[];
  profile: UserProfile;
  onSaveOutfit: (outfit: Outfit) => void;
  savedOutfitIds: string[];
}

export default function RecommendationsList({ outfits, profile, onSaveOutfit, savedOutfitIds }: RecommendationsListProps) {
  const [activeOutfitId, setActiveOutfitId] = useState<string>(outfits[0]?.id || "");
  const [likes, setLikes] = useState<{ [id: string]: boolean }>({});
  const [shared, setShared] = useState<string | null>(null);
  const [activeGarmentFilter, setActiveGarmentFilter] = useState<string>("all");

  const activeOutfit = outfits.find(o => o.id === activeOutfitId) || outfits[0];

  const toggleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (outfit: Outfit) => {
    const text = `Check out this amazing style look "${outfit.name}" curated specifically for a ${profile.occasion} by STYLOFY!`;
    navigator.clipboard.writeText(text);
    setShared(outfit.id);
    setTimeout(() => setShared(null), 2000);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Myntra":
        return <span className="text-[9px] tracking-wider border border-[#E7124A] text-[#E7124A] bg-[#E7124A]/5 px-1.5 py-0.5 rounded-none font-extrabold uppercase">Myntra</span>;
      case "Amazon":
        return <span className="text-[9px] tracking-wider border border-[#FF9900] text-[#FF9900] bg-[#FF9900]/5 px-1.5 py-0.5 rounded-none font-extrabold uppercase">Amazon</span>;
      case "Flipkart":
        return <span className="text-[9px] tracking-wider border border-[#2874F0] text-[#2874F0] bg-[#2874F0]/5 px-1.5 py-0.5 rounded-none font-extrabold uppercase">Flipkart</span>;
      case "Savana":
        return <span className="text-[9px] tracking-wider border border-[#8B3A62] text-[#8B3A62] bg-[#8B3A62]/5 px-1.5 py-0.5 rounded-none font-extrabold uppercase">Savana</span>;
      default:
        return <span className="text-[9px] tracking-wider border border-black text-black bg-white px-1.5 py-0.5 rounded-none font-extrabold uppercase">Store</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "clothing":
        return <Shirt className="w-3.5 h-3.5 text-white" />;
      case "jewelry":
        return <Sparkle className="w-3.5 h-3.5 text-white" />;
      case "footwear":
        return <Compass className="w-3.5 h-3.5 text-white" />;
      default:
        return <ShoppingBag className="w-3.5 h-3.5 text-white" />;
    }
  };

  // Safe categorization mapper for outfits
  const getCategoryDetails = (index: number) => {
    switch (index) {
      case 0:
        return { 
          label: "Occasion Wear", 
          desc: `Custom-tailored for your ${profile.occasion || "selected"} environment.`, 
          icon: Sparkles,
          bgAccent: "bg-[#FAF9F6]"
        };
      case 1:
        return { 
          label: "Street Style", 
          desc: "Edgy, self-expressive, and contemporary high-street trends.", 
          icon: Shirt,
          bgAccent: "bg-[#F3F4F6]"
        };
      case 2:
        return { 
          label: "Minimalist Classics", 
          desc: "Quiet luxury focus, timeless clean lines, and essential items.", 
          icon: Compass,
          bgAccent: "bg-[#FAF5FF]"
        };
      default:
        return { 
          label: "Contemporary Edit", 
          desc: "Sleek modern styling with a focus on premium silhouettes.", 
          icon: ShoppingBag,
          bgAccent: "bg-[#F0FDF4]"
        };
    }
  };

  // Matching helper for garment specific types
  const itemMatchesGarmentFilter = (item: FashionItem, filter: string): boolean => {
    if (filter === "all") return true;

    const nameLower = item.name.toLowerCase();
    const descLower = item.description.toLowerCase();
    const category = item.category;

    if (filter === "dresses") {
      const keywords = ["dress", "saree", "kurta", "gown", "suit", "anarkali", "top", "blazer", "shirt", "sherwani", "bandhgala", "blouse", "jacket", "t-shirt", "kurti", "co-ord", "shrug"];
      const isBottom = ["pant", "trouser", "jeans", "chinos", "cargo", "dhoti", "palazzo", "leggings", "shorts"].some(k => nameLower.includes(k));
      return category === "clothing" && (keywords.some(k => nameLower.includes(k) || descLower.includes(k)) || !isBottom);
    }

    if (filter === "trousers") {
      const keywords = ["trouser", "pant", "jeans", "chinos", "denim", "skirt", "cargo", "leggings", "palazzo", "dhoti", "jogger", "shorts", "bottom", "pajama"];
      return category === "clothing" && keywords.some(k => nameLower.includes(k) || descLower.includes(k));
    }

    if (filter === "sneakers") {
      const keywords = ["sneaker", "trainer", "canvas", "sport", "running", "tennis", "kicks", "athletic"];
      return category === "footwear" && keywords.some(k => nameLower.includes(k) || descLower.includes(k));
    }

    if (filter === "loafers") {
      const keywords = ["loafer", "oxford", "juttis", "sandal", "flat", "heel", "wedge", "pump", "derby", "monk", "slip-on", "mule", "boot", "brogue", "slides", "kolhapuri"];
      const isSneaker = ["sneaker", "trainer", "canvas"].some(k => nameLower.includes(k));
      return category === "footwear" && (keywords.some(k => nameLower.includes(k) || descLower.includes(k)) || !isSneaker);
    }

    if (filter === "jewelry") {
      return category === "jewelry";
    }

    return false;
  };

  const garmentFilters = [
    { id: "all", label: "All Curations", icon: ShoppingBag },
    { id: "dresses", label: "Dresses & Tops", icon: Shirt },
    { id: "trousers", label: "Trousers & Bottoms", icon: Layers },
    { id: "sneakers", label: "Sneakers", icon: Compass },
    { id: "loafers", label: "Loafers & Flats", icon: Compass },
    { id: "jewelry", label: "Statement Jewelry", icon: Sparkle },
  ];

  if (!activeOutfit) return null;

  // Filter items in the current active outfit
  const activeOutfitItemsFiltered = activeOutfit.items.filter(item => 
    itemMatchesGarmentFilter(item, activeGarmentFilter)
  );

  // If no items match in the active outfit, look for items in other outfits to provide choices
  const alternativeMatches: { item: FashionItem; outfitName: string; outfitId: string }[] = [];
  if (activeGarmentFilter !== "all" && activeOutfitItemsFiltered.length === 0) {
    outfits.forEach(outfit => {
      outfit.items.forEach(item => {
        if (itemMatchesGarmentFilter(item, activeGarmentFilter)) {
          // Avoid duplicates
          if (!alternativeMatches.some(m => m.item.id === item.id)) {
            alternativeMatches.push({ item, outfitName: outfit.name, outfitId: outfit.id });
          }
        }
      });
    });
  }

  return (
    <div className="space-y-8" id="recommendations-viewport">
      {/* Look Selector Header */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold text-black flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          CURATED ARCHITECTURE
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          Formulated styling directions structured across three distinct aesthetic categories.
        </p>
      </div>

      {/* NEW: Premium Categorized Grid / Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="categorized-vibe-tabs">
        {outfits.slice(0, 3).map((outfit, index) => {
          const details = getCategoryDetails(index);
          const IconComponent = details.icon;
          const isSelected = activeOutfitId === outfit.id;

          return (
            <button
              key={outfit.id}
              onClick={() => {
                setActiveOutfitId(outfit.id);
                // Keep the garment filter unless user switches to something else
              }}
              className={`text-left p-5 border-2 transition-all duration-200 rounded-none flex flex-col justify-between h-36 ${
                isSelected
                  ? "bg-black border-black text-white shadow-md"
                  : "bg-white border-black text-black hover:bg-gray-50 hover:translate-y-[-2px]"
              }`}
            >
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <span className={`p-1.5 border border-current rounded-none`}>
                    <IconComponent className="w-4 h-4" />
                  </span>
                  {isSelected && (
                    <span className="text-[9px] uppercase font-extrabold tracking-widest bg-white text-black px-1.5 py-0.5 border border-white">
                      Active Vibe
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-lg font-black uppercase italic tracking-tight leading-none mt-1">
                  {details.label}
                </h4>
                <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                  {details.desc}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest mt-2">
                <span>View Outfit</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Outfit Showcase Card */}
      <div className="bg-white rounded-none border-2 border-black p-6 sm:p-8 space-y-6 shadow-sm relative" id="active-outfit-showcase">
        
        {/* Style Concept Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FAF9F6] border border-black rounded-none p-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-extrabold tracking-widest bg-black text-white px-2.5 py-0.5 rounded-none border border-black">
                {activeOutfit.occasion}
              </span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">• Selected Curation</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-black tracking-tight uppercase italic">
              {activeOutfit.name}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-black pl-3 mt-2">
              &ldquo;{activeOutfit.styleTip}&rdquo;
            </p>
          </div>

          {/* Style actions */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 border-black pt-4 md:pt-0">
            <button
              onClick={() => toggleLike(activeOutfit.id)}
              id={`like-btn-${activeOutfit.id}`}
              className={`flex items-center justify-center p-3 rounded-none border border-black transition-all duration-200 ${
                likes[activeOutfit.id]
                  ? "bg-rose-50 text-rose-600"
                  : "bg-white text-gray-500 hover:text-black hover:bg-gray-50"
              }`}
              title="Like this styled look"
            >
              <Heart className={`w-5 h-5 ${likes[activeOutfit.id] ? "fill-rose-600 text-rose-600" : ""}`} />
            </button>

            <button
              onClick={() => onSaveOutfit(activeOutfit)}
              id={`save-btn-${activeOutfit.id}`}
              className={`flex items-center gap-2 px-5 py-3 rounded-none border border-black font-extrabold uppercase tracking-widest text-xs transition-all duration-200 ${
                savedOutfitIds.includes(activeOutfit.id)
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${savedOutfitIds.includes(activeOutfit.id) ? "fill-white" : ""}`} />
              {savedOutfitIds.includes(activeOutfit.id) ? "Saved" : "Save Outfit"}
            </button>

            <button
              onClick={() => handleShare(activeOutfit)}
              id={`share-btn-${activeOutfit.id}`}
              className="flex items-center justify-center p-3 rounded-none border border-black bg-white text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-200"
              title="Copy look specs to share"
            >
              {shared === activeOutfit.id ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* NEW: Segmented Garment Type Filter Bar */}
        <div className="border-y border-black py-4" id="garment-type-filters">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-black">
              🔍 Filter Garment or Accessory Type:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {garmentFilters.map(filter => {
                const isFilterActive = activeGarmentFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveGarmentFilter(filter.id)}
                    className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-none border transition-all duration-200 flex items-center gap-1.5 ${
                      isFilterActive
                        ? "bg-black border-black text-white"
                        : "bg-[#FAF9F6] border-gray-300 text-gray-700 hover:border-black hover:text-black"
                    }`}
                  >
                    <filter.icon className="w-3.5 h-3.5" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Items Breakdown Grid or Alternative results */}
        {activeOutfitItemsFiltered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" id="style-items-grid">
            {activeOutfitItemsFiltered.map((item) => {
              const unsplashImage = item.imageUrl || getFashionImage(item.category, profile.gender || "Women", item.name);
              const directBuyLink = item.affiliateUrl || getBuyNowLink(item.brandSuggestion, item.searchQuery);

              return (
                <div 
                  key={item.id}
                  id={`fashion-item-${item.id}`}
                  className="group flex flex-col bg-white border border-black rounded-none overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  {/* Visual Image card with Buy Now Overlay */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 border-b border-black">
                    <img 
                      src={unsplashImage} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category overlay */}
                    <div className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 rounded-none flex items-center gap-1.5 border border-black">
                      {getCategoryIcon(item.category)}
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-white">
                        {item.category}
                      </span>
                    </div>

                    {/* Affiliate Pick badge */}
                    {item.affiliateUrl && (
                      <div className="absolute top-3 right-3 bg-[#E7124A] text-white font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-black animate-pulse">
                        Affiliate Pick
                      </div>
                    )}

                    {/* Buy now on hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                      <a 
                        href={directBuyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black rounded-none font-extrabold uppercase tracking-widest text-[10px] shadow-sm hover:bg-gray-100 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Buy on {item.brandSuggestion}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Info and Purchase Links */}
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        {getPlatformIcon(item.brandSuggestion)}
                        <span className="text-xs font-mono font-black text-black">
                          {item.approxPrice}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-black text-sm line-clamp-1 leading-snug group-hover:underline transition-all">
                        {item.name}
                      </h4>

                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Colors and direct Buy Button */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {item.colors.map((color, i) => (
                          <span 
                            key={color + i} 
                            className="text-[9px] uppercase font-bold bg-gray-50 text-gray-700 px-1.5 py-0.5 rounded-none border border-gray-200"
                          >
                            {color}
                          </span>
                        ))}
                      </div>

                      <a 
                        href={directBuyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-black hover:bg-black/90 text-[10px] font-extrabold uppercase tracking-widest text-white rounded-none transition-all"
                      >
                        Buy Now
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : alternativeMatches.length > 0 ? (
          /* NEW: Beautiful alternative recommendations cross-outfit matches */
          <div className="space-y-4" id="alternative-matches-section">
            <div className="bg-amber-50 border border-amber-300 p-4 text-xs text-amber-900 rounded-none">
              ⚠️ No direct match for this category in <strong>{activeOutfit.name}</strong>. However, we found these perfect matching pieces in your other curated styling vibelist:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {alternativeMatches.map(({ item, outfitName, outfitId }) => {
                const unsplashImage = item.imageUrl || getFashionImage(item.category, profile.gender || "Women", item.name);
                const directBuyLink = item.affiliateUrl || getBuyNowLink(item.brandSuggestion, item.searchQuery);

                return (
                  <div 
                    key={item.id}
                    className="group flex flex-col bg-white border border-black rounded-none overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 border-b border-black">
                      <img 
                        src={unsplashImage} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      
                      <div className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 rounded-none flex items-center gap-1.5 border border-black">
                        {getCategoryIcon(item.category)}
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-white">
                          {item.category}
                        </span>
                      </div>

                      {/* Vibe Origin Badge */}
                      <div className="absolute bottom-3 left-3 bg-amber-400 text-black font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-black">
                        From: {outfitName.split(" ")[0]}
                      </div>
                    </div>

                    <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          {getPlatformIcon(item.brandSuggestion)}
                          <span className="text-xs font-mono font-black text-black">
                            {item.approxPrice}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-black text-sm line-clamp-1 leading-snug">
                          {item.name}
                        </h4>

                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setActiveOutfitId(outfitId);
                          }}
                          className="w-full text-center text-[9px] font-extrabold uppercase tracking-widest text-[#E7124A] hover:underline"
                        >
                          Switch to full {outfitName.split(" ")[0]} outfit →
                        </button>

                        <a 
                          href={directBuyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 w-full py-2 bg-black hover:bg-black/90 text-[10px] font-extrabold uppercase tracking-widest text-white rounded-none transition-all"
                        >
                          Buy Now
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State if absolutely no match anywhere */
          <div className="text-center py-16 border border-dashed border-gray-300 p-8 rounded-none" id="empty-garment-state">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h4 className="font-serif text-lg font-black uppercase text-black italic">
              No matching pieces found
            </h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              There are no curated items corresponding directly to this specific filter in your generated recommendations.
            </p>
            <button
              onClick={() => setActiveGarmentFilter("all")}
              className="mt-4 px-4 py-2 bg-black text-white text-xs font-extrabold uppercase tracking-widest rounded-none border-2 border-black hover:bg-gray-900"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Footer Disclaimer */}
        <p className="text-[10px] text-gray-500 text-center leading-relaxed font-sans border-t border-gray-100 pt-4">
          Affiliate & redirection disclosure: Shopping links query our partnered platforms Amazon, Flipkart, Myntra, and Savana dynamically in real-time. Prices are approximate and subject to store changes.
        </p>

      </div>
    </div>
  );
}

