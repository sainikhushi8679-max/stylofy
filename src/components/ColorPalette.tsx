import React, { useState } from "react";
import { ColorAnalysis, ColorShade } from "../types";
import { Copy, Check, Sparkles } from "lucide-react";

interface ColorPaletteProps {
  colorAnalysis: ColorAnalysis;
}

export default function ColorPalette({ colorAnalysis }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const getCategoryBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "warm":
        return "bg-amber-50 text-amber-900 border border-amber-400";
      case "cool":
        return "bg-blue-50 text-blue-900 border border-blue-400";
      case "pastel":
        return "bg-purple-50 text-purple-900 border border-purple-400";
      case "neutral":
        return "bg-gray-100 text-gray-900 border border-gray-400";
      case "jewel":
        return "bg-rose-50 text-rose-900 border border-rose-400";
      default:
        return "bg-gray-50 text-gray-900 border border-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-none border-2 border-black p-6 sm:p-8 space-y-6 shadow-sm" id="color-palette-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-white bg-black px-2.5 py-1 rounded-none">
              Tone Analysis
            </span>
            <span className="text-xs text-gray-600 font-bold">Palette: {colorAnalysis.paletteName}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-black flex items-center gap-2 uppercase tracking-tight italic">
            Your Personalized Styling Palette
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed max-w-2xl font-sans">
            {colorAnalysis.undertone}
          </p>
        </div>
      </div>

      {/* Palette Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {colorAnalysis.colors.map((color, index) => (
          <div 
            key={color.hex + index}
            id={`color-swatch-${index}`}
            className="group flex flex-col bg-white border border-black rounded-none p-4 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
          >
            {/* Color preview swatch */}
            <div 
              className="relative w-full aspect-square rounded-none border border-black/25 shadow-sm cursor-pointer flex items-center justify-center group/swatch"
              style={{ backgroundColor: color.hex }}
              onClick={() => copyToClipboard(color.hex)}
              title="Click to copy HEX code"
            >
              {/* Copy Hex HUD on hover */}
              <div className="absolute inset-0 bg-black/75 rounded-none opacity-0 group-hover/swatch:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                {copiedColor === color.hex ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 text-white" />
                    <span className="text-[10px] font-bold text-white font-mono">{color.hex}</span>
                  </>
                )}
              </div>
            </div>

            {/* Color Details */}
            <div className="mt-4 flex-grow flex flex-col">
              <span className={`self-start text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-none mb-1.5 ${getCategoryBadgeClass(color.type)}`}>
                {color.type}
              </span>
              <h3 className="text-sm font-extrabold text-black truncate mb-1">
                {color.name}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed flex-grow">
                {color.description}
              </p>
              <div 
                className="mt-3 flex items-center justify-between text-[10px] font-mono font-bold text-gray-500 cursor-pointer hover:text-black transition-colors border-t border-gray-100 pt-2"
                onClick={() => copyToClipboard(color.hex)}
              >
                <span>{color.hex}</span>
                <Copy className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Style Tip banner */}
      <div className="bg-[#FAF9F6] rounded-none border border-black p-4 flex items-start gap-3">
        <div className="bg-black p-2 rounded-none text-white">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-black">How to use your palette:</h4>
          <p className="text-xs text-gray-700 leading-relaxed">
            Combine your **Neutrals** as bases (trousers, jackets) and sprinkle your **Jewel Tones** or **Pastels** on shirts, accessories, or footwear to create striking, balanced focal points.
          </p>
        </div>
      </div>
    </div>
  );
}

