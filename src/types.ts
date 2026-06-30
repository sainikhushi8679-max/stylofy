export interface UserProfile {
  gender: "Men" | "Women" | "";
  skinTone: "Light" | "Medium" | "Tan" | "Deep" | "";
  undertone: "Warm" | "Cool" | "Neutral" | "";
  veinShade: "Blue/Purple" | "Green" | "Mix of Blue and Green" | "";
  bodyShape: "Pear" | "Apple" | "Hourglass" | "Rectangle" | "Athletic" | "Inverted Triangle" | "Oval" | "";
  faceShape: "Round" | "Oval" | "Square" | "Heart" | "Diamond" | "";
  occasion: "Casual" | "Office / Professional" | "College / Smart Casual" | "Party" | "Wedding" | "Festive" | "";
}

export interface ColorShade {
  name: string;
  hex: string;
  type: string; // warm, cool, pastel, neutral, jewel
  description: string;
}

export interface ColorAnalysis {
  undertone: string;
  paletteName: string;
  colors: ColorShade[];
}

export interface FashionItem {
  id: string;
  category: "clothing" | "jewelry" | "footwear";
  name: string;
  description: string;
  brandSuggestion: "Amazon" | "Flipkart" | "Myntra" | "Savana" | "Boutique" | "Store";
  approxPrice: string;
  colors: string[];
  searchQuery: string;
  affiliateUrl?: string;
  imageUrl?: string;
}

export interface Outfit {
  id: string;
  name: string;
  occasion: string;
  styleTip: string;
  items: FashionItem[];
}

export interface RecommendationResponse {
  colorAnalysis: ColorAnalysis;
  outfits: Outfit[];
}

export interface SavedOutfit {
  id: string;
  outfit: Outfit;
  profile: UserProfile;
  savedAt: string;
  liked: boolean;
  notes?: string;
}
