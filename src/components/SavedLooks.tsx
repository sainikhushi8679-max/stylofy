import React, { useState } from "react";
import { SavedOutfit } from "../types";
import { getFashionImage, getBuyNowLink } from "../utils/imageHelper";
import { 
  Heart, 
  Trash2, 
  ExternalLink, 
  Save, 
  Edit3, 
  Clock,
  Sparkles
} from "lucide-react";

interface SavedLooksProps {
  savedOutfits: SavedOutfit[];
  onDeleteOutfit: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function SavedLooks({ savedOutfits, onDeleteOutfit, onUpdateNotes }: SavedLooksProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>("");

  const startEditing = (id: string, currentNotes: string) => {
    setEditingId(id);
    setTempNotes(currentNotes || "");
  };

  const saveNotes = (id: string) => {
    onUpdateNotes(id, tempNotes);
    setEditingId(null);
  };

  if (savedOutfits.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-none border-2 border-black p-10 max-w-4xl mx-auto" id="saved-looks-empty">
        <div className="bg-gray-100 w-16 h-16 rounded-none flex items-center justify-center mx-auto mb-6 border border-black">
          <Heart className="w-8 h-8 text-black" />
        </div>
        <h3 className="font-serif text-2xl font-black text-black mb-2 uppercase italic">No Saved Looks Yet</h3>
        <p className="text-xs text-gray-600 max-w-md mx-auto mb-6">
          Use the AI Stylist to generate customized fashion proposals, then tap &quot;Save Outfit&quot; to build your personal style capsule here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="saved-looks-viewport">
      <div>
        <h2 className="font-serif text-3xl font-black text-black tracking-tight uppercase italic">
          Your Personal Style Wardrobe
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Review and coordinate your saved aesthetic proposals. Write notes to help plan your shopping.
        </p>
      </div>

      <div className="space-y-8">
        {savedOutfits.map((saved) => (
          <div 
            key={saved.id}
            id={`saved-look-card-${saved.id}`}
            className="bg-white rounded-none border-2 border-black overflow-hidden shadow-sm"
          >
            {/* Saved Card Header: Metadata & Profile */}
            <div className="bg-[#FAF9F6] border-b border-black p-5 sm:p-6 flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-wider bg-black text-white px-2.5 py-0.5 rounded-none font-extrabold uppercase">
                    ⭐ SAVED STYLE
                  </span>
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-black" />
                    {new Date(saved.savedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-black uppercase italic">
                  {saved.outfit.name}
                </h3>
              </div>

              {/* Attributes Chips */}
              <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
                <span className="text-[10px] tracking-wider bg-white text-black border border-black px-2 py-1 rounded-none font-extrabold uppercase">
                  {saved.profile.gender}
                </span>
                <span className="text-[10px] tracking-wider bg-white text-black border border-black px-2 py-1 rounded-none font-extrabold uppercase">
                  {saved.profile.bodyShape} Body
                </span>
                <span className="text-[10px] tracking-wider bg-white text-black border border-black px-2 py-1 rounded-none font-extrabold uppercase">
                  {saved.profile.skinTone} Tone
                </span>
                <span className="text-[10px] tracking-wider bg-black text-white border border-black px-2 py-1 rounded-none font-extrabold uppercase">
                  🎯 {saved.outfit.occasion}
                </span>
              </div>
            </div>

            {/* Content: Items Grid & Wardrobe Notes */}
            <div className="p-5 sm:p-6 space-y-6">
              
              {/* Outfit styling advice */}
              <div className="bg-[#FAF9F6] border-l-4 border-black p-4 text-xs text-gray-700 italic leading-relaxed">
                <span className="text-black font-extrabold uppercase tracking-widest block mb-1">Stylist Advice:</span>
                &ldquo;{saved.outfit.styleTip}&rdquo;
              </div>

              {/* Items row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {saved.outfit.items.map((item) => {
                  const itemImage = item.imageUrl || getFashionImage(item.category, saved.profile.gender || "Women", item.name);
                  const itemBuyLink = item.affiliateUrl || getBuyNowLink(item.brandSuggestion, item.searchQuery);

                  return (
                    <div 
                      key={item.id} 
                      className="bg-white border border-black rounded-none overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/5] w-full bg-gray-50 border-b border-black">
                        <img 
                          src={itemImage} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 rounded-none text-[9px] uppercase font-extrabold border border-black">
                          {item.category}
                        </div>
                        {item.affiliateUrl && (
                          <div className="absolute top-2 right-2 bg-[#E7124A] text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-none border border-black">
                            Affiliate Pick
                          </div>
                        )}
                      </div>

                      <div className="p-3 space-y-2 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-extrabold text-black line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-gray-500 block mt-0.5">
                            {item.brandSuggestion}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-black font-black">
                            {item.approxPrice}
                          </span>
                          <a 
                            href={itemBuyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-extrabold uppercase tracking-widest text-black underline underline-offset-2 flex items-center gap-1"
                          >
                            Shop
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Notes & Actions Bar */}
              <div className="pt-4 border-t border-black flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                
                {/* Notes Column */}
                <div className="flex-grow max-w-xl">
                  {editingId === saved.id ? (
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Add fit, color adjustments, or reminders..."
                        className="flex-grow text-xs bg-white border border-black rounded-none px-3 py-2 text-black placeholder-gray-400 focus:outline-none"
                      />
                      <button
                        onClick={() => saveNotes(saved.id)}
                        className="bg-black text-white px-4 py-2 rounded-none text-xs font-extrabold uppercase tracking-widest hover:bg-gray-800 flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 group cursor-pointer" onClick={() => startEditing(saved.id, saved.notes || "")}>
                      <div className="text-xs text-gray-600 flex-grow">
                        <span className="text-black font-extrabold block text-[10px] uppercase tracking-wider mb-1">WARDROBE NOTES</span>
                        {saved.notes ? (
                          <span className="text-gray-900 font-medium">{saved.notes}</span>
                        ) : (
                          <span className="text-gray-400 italic">No styling notes yet. Click to add fit specs, coordinate sizes, or comments.</span>
                        )}
                      </div>
                      <button className="text-black p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onDeleteOutfit(saved.id)}
                  className="self-end sm:self-center bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 px-4 py-2 rounded-none text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Discard Look
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
