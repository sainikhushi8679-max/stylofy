import React from "react";
import { Sparkles, Heart, Compass, Key } from "lucide-react";

interface AppHeaderProps {
  activeTab: "stylist" | "saved" | "guide" | "admin";
  setActiveTab: (tab: "stylist" | "saved" | "guide" | "admin") => void;
  savedCount: number;
}

export default function AppHeader({ activeTab, setActiveTab, savedCount }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-black py-5 px-6 sm:px-10" id="app-header">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand Identity */}
        <div className="flex items-baseline gap-2 cursor-pointer" onClick={() => setActiveTab("stylist")}>
          <h1 className="font-serif font-black text-3xl sm:text-4xl tracking-tighter uppercase italic text-[#1A1A1A]">
            STYLOFY
          </h1>
          <span className="font-sans text-[9px] tracking-[0.25em] font-bold text-gray-500 uppercase">
            STUDIO
          </span>
        </div>

        {/* Navigation Tabs (Editorial Print-inspired style) */}
        <nav className="flex items-center gap-6 sm:gap-8 font-sans text-xs uppercase tracking-widest font-extrabold text-[#1A1A1A]">
          <button
            id="tab-stylist"
            onClick={() => setActiveTab("stylist")}
            className={`flex items-center gap-1.5 py-1 transition-all duration-200 relative ${
              activeTab === "stylist"
                ? "underline underline-offset-8 decoration-2 decoration-black text-black"
                : "opacity-40 hover:opacity-90"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Stylist
          </button>
          
          <button
            id="tab-saved"
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-1.5 py-1 transition-all duration-200 relative ${
              activeTab === "saved"
                ? "underline underline-offset-8 decoration-2 decoration-black text-black"
                : "opacity-40 hover:opacity-90"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Saved Looks
            {savedCount > 0 && (
              <span className="ml-1 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-none">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="tab-guide"
            onClick={() => setActiveTab("guide")}
            className={`flex items-center gap-1.5 py-1 transition-all duration-200 relative ${
              activeTab === "guide"
                ? "underline underline-offset-8 decoration-2 decoration-black text-black"
                : "opacity-40 hover:opacity-90"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Style Guide
          </button>

          <button
            id="tab-admin"
            onClick={() => setActiveTab("admin")}
            className={`flex items-center gap-1.5 py-1 transition-all duration-200 relative ${
              activeTab === "admin"
                ? "underline underline-offset-8 decoration-2 decoration-black text-black"
                : "opacity-40 hover:opacity-90"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Admin Panel
          </button>
        </nav>
      </div>
    </header>
  );
}

