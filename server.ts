import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON request bodies
app.use(express.json());

// Path to custom affiliate products
const PRODUCTS_FILE = path.join(process.cwd(), "src", "data", "products.json");

// Helper to read products
function readProducts(): any[] {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      // Ensure folder exists
      const dir = path.dirname(PRODUCTS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(PRODUCTS_FILE, "[]", "utf-8");
      return [];
    }
    const content = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(content || "[]");
  } catch (err) {
    console.error("Error reading products database:", err);
    return [];
  }
}

// Helper to write products
function writeProducts(products: any[]): void {
  try {
    const dir = path.dirname(PRODUCTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing products database:", err);
  }
}

// Admin Auth endpoint
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    res.json({ success: true, token: "stylofy-secret-session-token-2026" });
  } else {
    res.status(401).json({ error: "Invalid admin credentials. Use username 'admin' and password 'admin'." });
  }
});

// Admin Authentication Middleware
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer stylofy-secret-session-token-2026") {
    res.status(401).json({ error: "Unauthorized access. Valid admin session token is required." });
    return;
  }
  next();
};

// Admin Products retrieval
app.get("/api/admin/products", requireAdmin, (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Admin Add Product
app.post("/api/admin/products", requireAdmin, (req, res) => {
  try {
    const { 
      name, category, description, brandSuggestion, approxPrice, 
      colors, searchQuery, affiliateUrl, imageUrl, gender, occasion 
    } = req.body;

    if (!name || !category || !brandSuggestion || !approxPrice || !gender || !occasion) {
      res.status(400).json({ error: "Missing required product fields." });
      return;
    }

    const products = readProducts();
    const newProduct = {
      id: "prod-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      name,
      category,
      description: description || `Premium ${category} handpicked by Stylofy curator.`,
      brandSuggestion,
      approxPrice,
      colors: Array.isArray(colors) ? colors : (colors ? String(colors).split(",").map(c => c.trim()) : []),
      searchQuery: searchQuery || name,
      affiliateUrl: affiliateUrl || "",
      imageUrl: imageUrl || "",
      gender,
      occasion
    };

    products.unshift(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to add custom product." });
  }
});

// Admin Delete Product
app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    let products = readProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    if (products.length === initialLength) {
      res.status(404).json({ error: "Product not found." });
      return;
    }
    writeProducts(products);
    res.json({ success: true, message: "Product deleted successfully." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete product." });
  }
});

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not configured in the environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// AI recommendation endpoint
app.post("/api/stylist/recommend", async (req, res) => {
  try {
    const { gender, skinTone, undertone, veinShade, bodyShape, faceShape, occasion } = req.body;

    if (!gender || !skinTone || !bodyShape || !faceShape || !occasion) {
      res.status(400).json({ error: "Missing required profile parameters." });
      return;
    }

    // Load custom affiliate products
    const allProducts = readProducts();
    // Filter matching products
    const matchingProducts = allProducts.filter(p => {
      const gMatch = p.gender === "Unisex" || p.gender === "All" || p.gender === gender;
      const oMatch = p.occasion === "All" || p.occasion === occasion;
      return gMatch && oMatch;
    });

    const ai = getGeminiClient();

    const prompt = `You are Stylofy, an elite, AI-powered personal fashion stylist. 
Analyze the following user profile and provide bespoke styling advice, custom color palette, and specific outfit recommendations (including clothing, jewelry/accessories, and footwear) that maximize their confidence, complement their natural features, and fit the target occasion.

User Profile:
- Gender: ${gender}
- Skin Tone: ${skinTone}
- Undertone & Vein Shade: Undertone is ${undertone || "Not specified"}, vein/nerve color is ${veinShade || "Not specified"}.
- Body Shape: ${bodyShape}
- Face Shape: ${faceShape}
- Occasion: ${occasion}

Requirements:
1. Color Analysis: Generate a personalized seasonal color palette containing 5 curated colors (Warm shade, Cool shade, Pastel, Neutral, Jewel tone) that suit their skin tone, undertone, and vein color. Give each color a beautiful, realistic fashion name and its hex code.
2. Outfit Recommendations: Generate exactly 3 fully styled, highly curated outfits. Each outfit must be an entire look (comprising 4-5 items: including clothing, matching jewelry/accessories, and suitable footwear) specifically designed for their body shape, face shape, and the occasion.
   - For EACH outfit, give it a stylish name and a detailed, encouraging stylist paragraph on how to pull it off.
   - For EACH item in the outfit, provide the name, category (clothing, jewelry, or footwear), a detailed styling reason why it suits their attributes, the best brand/platform suggestion (either Myntra, Savana, Amazon, or Flipkart), an approximate price (in INR e.g. ₹1,200 - ₹2,000), suggested colors, and a highly specific search query suitable for e-commerce search engines to find this exact item.

3. Rich Styling Diversity:
   - Provide highly specific, diverse suggestions for clothing, footwear, and jewelry. 
   - Suggest a wide variety of fashionable clothing styles (such as heavy embroidered Anarkali suits, premium Banarasi silk sarees, A-line maxi gowns, elegant floral wrap dresses, custom high-waisted pencil skirts, sharp double-breasted blazers, traditional bandhgala sherwanis, smart mandarin collar shirts, or tailored linen trousers).
   - Suggest diverse, gorgeous footwear options (such as ethnic handcrafted Juttis, embellished Kolhapuri sandals, block-heel wedges, stiletto pumps, leather monk straps, hand-burnished Oxfords, suede loafers, or retro high-top canvas sneakers).
   - Suggest highly curated jewelry types (such as Polki Kundan chandelier earrings, multi-layered pearl necklaces, geometric sterling silver chokers, delicate teardrop earrings, slate-dial chronograph watches, or traditional brass kada bracelets).

4. Real Sponsored / Affiliate Products:
   - Below is a list of real affiliate sponsor products currently in stock. If any of these products fit the target gender, category, and occasion, you MUST prioritize integrating them into the 3 outfits!
   Available Affiliate Products to Inject:
   ${JSON.stringify(matchingProducts, null, 2)}
   - When you use an affiliate product, preserve its exact 'id', 'name', 'brandSuggestion', 'approxPrice', 'category', 'affiliateUrl', and 'imageUrl' in your response.

Provide the response in perfect JSON conforming strictly to the requested schema. Ensure all suggestions are modern, elegant, and highly practical.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colorAnalysis: {
              type: Type.OBJECT,
              properties: {
                undertone: { type: Type.STRING, description: "Detailed description of their skin tone and undertone analysis." },
                paletteName: { type: Type.STRING, description: "A creative name for their custom seasonal palette." },
                colors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Name of the color (e.g. Classic Navy)." },
                      hex: { type: Type.STRING, description: "Valid 6-character hex color code starting with '#' (e.g. #0A192F)." },
                      type: { type: Type.STRING, description: "Category of the color shade (warm, cool, pastel, neutral, jewel)." },
                      description: { type: Type.STRING, description: "Brief tip on how to style or wear this color." }
                    },
                    required: ["name", "hex", "type", "description"]
                  }
                }
              },
              required: ["undertone", "paletteName", "colors"]
            },
            outfits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique short string ID for the outfit." },
                  name: { type: Type.STRING, description: "Name of the styled look (e.g., Elevated Executive, Smart Casual Coffee, Regal Wedding Guest)." },
                  occasion: { type: Type.STRING, description: "The occasion matching this outfit." },
                  styleTip: { type: Type.STRING, description: "A comprehensive styling advice or tip detailing how to pull off this complete look." },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING, description: "Unique string ID for the item." },
                        category: { type: Type.STRING, description: "Category of the fashion item (clothing, jewelry, footwear)." },
                        name: { type: Type.STRING, description: "Precise descriptive name of the item (e.g., Midnight Blue Slim-fit Oxford Shirt)." },
                        description: { type: Type.STRING, description: "Detailed description explaining why this item fits their body shape and skin tone." },
                        brandSuggestion: { type: Type.STRING, description: "E-commerce platform that best fits this item type (Myntra, Savana, Amazon, Flipkart)." },
                        approxPrice: { type: Type.STRING, description: "Approximate price range (e.g., ₹1,500 - ₹2,500)." },
                        colors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggested colors for this item." },
                        searchQuery: { type: Type.STRING, description: "A search query optimized for e-commerce search engines to find this exact item." },
                        affiliateUrl: { type: Type.STRING, description: "Direct affiliate link for this product if specified in the sponsor/affiliate list (else empty string)." },
                        imageUrl: { type: Type.STRING, description: "Direct custom image URL for this product if specified in the sponsor/affiliate list (else empty string)." }
                      },
                      required: ["id", "category", "name", "description", "brandSuggestion", "approxPrice", "colors", "searchQuery"]
                    }
                  }
                },
                required: ["id", "name", "occasion", "styleTip", "items"]
              }
            }
          },
          required: ["colorAnalysis", "outfits"]
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API.");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in styling recommendation endpoint:", error);
    res.status(500).json({ error: error.message || "Failed to generate styling recommendations." });
  }
});

// Configure Vite or Static Asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`STYLOFY full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
