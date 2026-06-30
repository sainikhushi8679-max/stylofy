import React, { useState, useEffect } from "react";
import { Plus, Trash2, Key, ShoppingBag, Eye, EyeOff, ExternalLink, Image as ImageIcon, Sparkles, Check, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: "clothing" | "jewelry" | "footwear";
  description: string;
  brandSuggestion: "Amazon" | "Flipkart" | "Myntra" | "Savana" | "Boutique" | "Store";
  approxPrice: string;
  colors: string[];
  searchQuery: string;
  affiliateUrl: string;
  imageUrl: string;
  gender: "Men" | "Women" | "Unisex";
  occasion: string;
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("stylofy_admin_token");
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"clothing" | "jewelry" | "footwear">("clothing");
  const [description, setDescription] = useState("");
  const [brandSuggestion, setBrandSuggestion] = useState<"Amazon" | "Flipkart" | "Myntra" | "Savana" | "Boutique" | "Store">("Myntra");
  const [approxPrice, setApproxPrice] = useState("");
  const [colors, setColors] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gender, setGender] = useState<"Men" | "Women" | "Unisex">("Women");
  const [occasion, setOccasion] = useState("Casual");

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("stylofy_admin_token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/products", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.status === 401) {
        handleLogout();
        setAuthError("Session expired or unauthorized. Please log in again.");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("stylofy_admin_token", data.token);
        setIsLoggedIn(true);
        setAuthError(null);
      } else {
        const err = await res.json();
        setAuthError(err.error || "Login failed");
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("stylofy_admin_token");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setProducts([]);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const token = localStorage.getItem("stylofy_admin_token");
    if (!token) {
      handleLogout();
      return;
    }

    if (!name || !approxPrice || !affiliateUrl) {
      setFormError("Please fill in all required fields (Product Name, Price, and Affiliate Link).");
      return;
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          category,
          description,
          brandSuggestion,
          approxPrice,
          colors: colors.split(",").map(c => c.trim()).filter(Boolean),
          searchQuery: searchQuery || name,
          affiliateUrl,
          imageUrl,
          gender,
          occasion
        })
      });

      if (res.status === 401) {
        handleLogout();
        setAuthError("Your session is invalid or has expired. Please log in again.");
        return;
      }

      if (res.ok) {
        setSuccessMessage("Product added successfully to affiliate list!");
        // Clear fields
        setName("");
        setDescription("");
        setApproxPrice("");
        setColors("");
        setSearchQuery("");
        setAffiliateUrl("");
        setImageUrl("");
        fetchProducts();
      } else {
        const err = await res.json();
        setFormError(err.error || "Failed to add product");
      }
    } catch (err) {
      setFormError("Network error. Could not add product.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const token = localStorage.getItem("stylofy_admin_token");
    if (!token) {
      handleLogout();
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.status === 401) {
        handleLogout();
        setAuthError("Your session is invalid or has expired. Please log in again.");
        return;
      }
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12" id="admin-login-view">
        <div className="bg-white border-2 border-black p-8 rounded-none shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-2 border-2 border-black">
              <Key className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-3xl font-black text-black uppercase italic tracking-tight">
              ADMIN ACCESS
            </h2>
            <p className="text-xs text-gray-500 font-sans tracking-wide">
              Stylofy Curator & Affiliate Merchandiser Portal
            </p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-red-900 text-red-700 p-3 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" id="admin-login-form">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-extrabold tracking-widest text-black">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full border-2 border-black p-3 text-xs rounded-none bg-[#FAF9F6] focus:outline-none focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-extrabold tracking-widest text-black">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full border-2 border-black p-3 pr-10 text-xs rounded-none bg-[#FAF9F6] focus:outline-none focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-black hover:bg-gray-900 text-white font-extrabold uppercase tracking-widest text-xs border-2 border-black transition-colors"
            >
              Authenticate & Enter
            </button>
          </form>

          <div className="pt-2 text-center">
            <span className="text-[10px] font-mono text-gray-400">
              Credentials: admin / admin
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10" id="admin-dashboard-view">
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="font-serif text-3xl font-black text-black uppercase italic tracking-tight">
            Curator Dashboard
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            Manage real sponsor collections & affiliate tracking details integrated into Gemini styling recommendations.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-extrabold uppercase tracking-widest border-2 border-black bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-none transition-all"
        >
          Logout Admin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ADD PRODUCT FORM */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-2 border-black p-6 rounded-none shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-black uppercase italic text-black border-b border-black pb-2 flex items-center gap-2">
              <Plus className="w-5 h-5 text-black" /> Add Affiliate Product
            </h3>

            {formError && (
              <div className="bg-rose-50 border border-red-900 text-red-700 p-3 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-900 text-emerald-800 p-3 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-4" id="add-product-form">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-extrabold tracking-widest text-black">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sabyasachi Luxury Kundan Necklace"
                  className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6]"
                  required
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-extrabold tracking-widest text-black">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6] h-10"
                  >
                    <option value="clothing">👗 Clothing / Dresses</option>
                    <option value="footwear">👟 Footwear / Shoes</option>
                    <option value="jewelry">✨ Jewelry / Accs</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-extrabold tracking-widest text-black">
                    Platform *
                  </label>
                  <select
                    value={brandSuggestion}
                    onChange={(e) => setBrandSuggestion(e.target.value as any)}
                    className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6] h-10"
                  >
                    <option value="Myntra">Myntra</option>
                    <option value="Savana">Savana</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Store">Boutique Store</option>
                  </select>
                </div>
              </div>

              {/* Target Gender & Occasion */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-extrabold tracking-widest text-black">
                    Target Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6] h-10"
                  >
                    <option value="Women">Women Only</option>
                    <option value="Men">Men Only</option>
                    <option value="Unisex">Unisex / All</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-extrabold tracking-widest text-black">
                    Occasion *
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6] h-10"
                  >
                    <option value="Casual">Casual</option>
                    <option value="Office / Professional">Office / Meetings</option>
                    <option value="College / Smart Casual">College / Smart Casual</option>
                    <option value="Party">Party</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Festive">Festive</option>
                    <option value="All">All Occasions</option>
                  </select>
                </div>
              </div>

              {/* Price & Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-extrabold tracking-widest text-black">
                    Approx Price *
                  </label>
                  <input
                    type="text"
                    value={approxPrice}
                    onChange={(e) => setApproxPrice(e.target.value)}
                    placeholder="e.g. ₹1,499"
                    className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-extrabold tracking-widest text-black">
                    Suggested Colors
                  </label>
                  <input
                    type="text"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    placeholder="e.g. Emerald, Gold (comma separated)"
                    className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6]"
                  />
                </div>
              </div>

              {/* Affiliate Buy Link */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-extrabold tracking-widest text-black">
                  Affiliate URL *
                </label>
                <input
                  type="url"
                  value={affiliateUrl}
                  onChange={(e) => setAffiliateUrl(e.target.value)}
                  placeholder="e.g. https://www.myntra.com/affiliate/..."
                  className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6]"
                  required
                />
              </div>

              {/* Direct Image URL */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-extrabold tracking-widest text-black">
                  Product Image URL (Unsplash or Direct Link)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-extrabold tracking-widest text-black">
                  Stylist Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the client why this item is perfect, what body attributes it complements, or how to style it..."
                  rows={3}
                  className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6]"
                />
              </div>

              {/* Search Query fallback */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-extrabold tracking-widest text-black flex items-center gap-1">
                  Search Query Fallback <span className="text-gray-400 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sabyasachi gold plated kundan necklace green"
                  className="w-full border border-black p-2.5 text-xs rounded-none bg-[#FAF9F6]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black hover:bg-gray-900 text-white font-extrabold uppercase tracking-widest text-xs border border-black flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add to Store Pool
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: LIST OF PRODUCTS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border-2 border-black p-6 rounded-none shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-black pb-2">
              <h3 className="font-serif text-xl font-black uppercase italic text-black">
                Active Store Pool ({products.length})
              </h3>
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                Synchronized with Gemini
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-xs font-extrabold tracking-wider text-gray-400 uppercase">
                Loading live product database...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 p-8">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  No products in the pool
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Add custom products on the left to prioritize them in the AI stylist advice.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-1">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="border border-black bg-white flex flex-col justify-between rounded-none overflow-hidden hover:shadow-sm transition-all"
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="aspect-[16/9] w-full bg-gray-50 border-b border-black relative">
                        {prod.imageUrl ? (
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback on broken URL
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                            <ImageIcon className="w-8 h-8 mb-1" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">No Custom Image</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-black text-white text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-widest border border-black">
                          {prod.category}
                        </span>
                        <span className="absolute top-2 right-2 bg-amber-400 text-black text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-widest border border-black">
                          {prod.brandSuggestion}
                        </span>
                      </div>

                      {/* Info details */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-extrabold text-black text-sm leading-snug line-clamp-1">
                            {prod.name}
                          </h4>
                          <span className="text-xs font-mono font-black text-black shrink-0">
                            {prod.approxPrice}
                          </span>
                        </div>

                        <p className="text-[10px] text-gray-700 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[8px] font-mono uppercase bg-gray-100 text-gray-700 border border-gray-200 px-1.5 py-0.5 font-semibold">
                            🚻 {prod.gender}
                          </span>
                          <span className="text-[8px] font-mono uppercase bg-gray-100 text-gray-700 border border-gray-200 px-1.5 py-0.5 font-semibold">
                            📍 {prod.occasion}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-3 border-t border-gray-100 bg-[#FAF9F6] flex items-center justify-between gap-2">
                      <a
                        href={prod.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-extrabold uppercase tracking-widest text-black flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Affiliate Link
                      </a>

                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-red-600 hover:text-red-800 p-1 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
