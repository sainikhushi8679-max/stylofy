export function getFashionImage(category: "clothing" | "jewelry" | "footwear", gender: string, name: string): string {
  const lowerName = name.toLowerCase();
  
  if (category === "jewelry") {
    if (gender === "Women") {
      if (lowerName.includes("earring") || lowerName.includes("jhumka")) {
        return "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80";
      }
      if (lowerName.includes("necklace") || lowerName.includes("pendant") || lowerName.includes("choker")) {
        return "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80";
      }
      if (lowerName.includes("ring") || lowerName.includes("band")) {
        return "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80";
      }
      if (lowerName.includes("bangle") || lowerName.includes("bracelet")) {
        return "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=80";
      }
      return "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80";
    } else {
      if (lowerName.includes("watch") || lowerName.includes("chronograph")) {
        return "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=500&q=80";
      }
      if (lowerName.includes("ring") || lowerName.includes("band")) {
        return "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=500&q=80";
      }
      if (lowerName.includes("bracelet") || lowerName.includes("chain") || lowerName.includes("kada")) {
        return "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=80";
      }
      return "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=500&q=80";
    }
  }
  
  if (category === "footwear") {
    if (gender === "Women") {
      if (lowerName.includes("heel") || lowerName.includes("stiletto") || lowerName.includes("pump") || lowerName.includes("wedges")) {
        return "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80";
      }
      if (lowerName.includes("sneaker") || lowerName.includes("trainer") || lowerName.includes("sport")) {
        return "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80";
      }
      if (lowerName.includes("flat") || lowerName.includes("bellies") || lowerName.includes("mojris") || lowerName.includes("juttis") || lowerName.includes("ethnic")) {
        return "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=500&q=80";
      }
      return "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80";
    } else {
      if (lowerName.includes("sneaker") || lowerName.includes("sports") || lowerName.includes("trainer")) {
        return "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80";
      }
      if (lowerName.includes("loaf") || lowerName.includes("slip") || lowerName.includes("moccasin")) {
        return "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=500&q=80";
      }
      if (lowerName.includes("formal") || lowerName.includes("oxford") || lowerName.includes("derby") || lowerName.includes("brogues") || lowerName.includes("monk")) {
        return "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=500&q=80";
      }
      if (lowerName.includes("ethnic") || lowerName.includes("juttis") || lowerName.includes("mojris") || lowerName.includes("sandal")) {
        return "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=500&q=80";
      }
      return "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80";
    }
  }

  // Clothing
  if (gender === "Women") {
    if (lowerName.includes("ethnic") || lowerName.includes("kurta") || lowerName.includes("saree") || lowerName.includes("lehenga") || lowerName.includes("anarkali")) {
      return "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80";
    }
    if (lowerName.includes("dress") || lowerName.includes("gown") || lowerName.includes("frock") || lowerName.includes("maxi")) {
      return "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80";
    }
    if (lowerName.includes("blazer") || lowerName.includes("suit") || lowerName.includes("coat") || lowerName.includes("formal")) {
      return "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=500&q=80";
    }
    if (lowerName.includes("jean") || lowerName.includes("trouser") || lowerName.includes("pant") || lowerName.includes("skirt")) {
      return "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80";
    }
    return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80";
  } else {
    if (lowerName.includes("formal") || lowerName.includes("blazer") || lowerName.includes("suit") || lowerName.includes("coat") || lowerName.includes("tuxedo")) {
      return "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80";
    }
    if (lowerName.includes("kurta") || lowerName.includes("sherwani") || lowerName.includes("ethnic") || lowerName.includes("nehru")) {
      return "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80";
    }
    if (lowerName.includes("jacket") || lowerName.includes("hoodie") || lowerName.includes("bomber") || lowerName.includes("sweater")) {
      return "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80";
    }
    if (lowerName.includes("shirt") || lowerName.includes("polo") || lowerName.includes("tee") || lowerName.includes("t-shirt")) {
      return "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=80";
    }
    return "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80";
  }
}

export function getBuyNowLink(brand: string, query: string): string {
  const enc = encodeURIComponent(query);
  switch (brand) {
    case "Myntra":
      return `https://www.myntra.com/search?q=${enc}`;
    case "Amazon":
      return `https://www.amazon.in/s?k=${enc}`;
    case "Flipkart":
      return `https://www.flipkart.com/search?q=${enc}`;
    case "Savana":
      // Savana.com search url
      return `https://www.savana.com/search?q=${enc}`;
    default:
      return `https://www.google.com/search?q=${enc}`;
  }
}
