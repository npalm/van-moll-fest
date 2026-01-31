// Brewery data with Untappd URLs and colors for placeholders
export interface Brewery {
  name: string;
  slug: string;
  url: string;
  color: string;
}

// Manually verified Untappd brewery slugs and brand colors
export const BREWERIES: Record<string, Brewery> = {
  "CRAK": {
    name: "CRAK",
    slug: "CRAKBrewery",
    url: "https://untappd.com/CRAKBrewery",
    color: "#f97316" // orange
  },
  "The Garden Brewery": {
    name: "The Garden Brewery",
    slug: "TheGardenBrewery",
    url: "https://untappd.com/TheGardenBrewery",
    color: "#22c55e" // green
  },
  "Lost Brewing": {
    name: "Lost Brewing",
    slug: "Brouwerij_LOST",
    url: "https://untappd.com/Brouwerij_LOST",
    color: "#3b82f6" // blue
  },
  "Maisel & Friends": {
    name: "Maisel & Friends",
    slug: "MaiselAndFriends",
    url: "https://untappd.com/MaiselAndFriends",
    color: "#eab308" // yellow
  },
  "Bayreuther": {
    name: "Bayreuther",
    slug: "BayreutherBierbrauerei",
    url: "https://untappd.com/BayreutherBierbrauerei",
    color: "#dc2626" // red
  },
  "Mederij Marcus": {
    name: "Mederij Marcus",
    slug: "MederijMarcus",
    url: "https://untappd.com/MederijMarcus",
    color: "#f59e0b" // amber
  },
  "De Moersleutel": {
    name: "De Moersleutel",
    slug: "Moersleutel",
    url: "https://untappd.com/Moersleutel",
    color: "#8b5cf6" // purple
  },
  "Van Moll": {
    name: "Van Moll",
    slug: "VanMoll",
    url: "https://untappd.com/VanMoll",
    color: "#ef4444" // red
  },
  "Moon Lark": {
    name: "Moon Lark",
    slug: "MoonLarkDistillery",
    url: "https://untappd.com/MoonLarkDistillery",
    color: "#6366f1" // indigo
  },
  "Prizm Brewing": {
    name: "Prizm Brewing",
    slug: "PrizmBrewing",
    url: "https://untappd.com/PrizmBrewing",
    color: "#ec4899" // pink
  },
  "Salikatt": {
    name: "Salikatt",
    slug: "Salikatt_Bryggeri",
    url: "https://untappd.com/Salikatt_Bryggeri",
    color: "#14b8a6" // teal
  },
  "Salt Beer Factory": {
    name: "Salt Beer Factory",
    slug: "SaltBeerFactory",
    url: "https://untappd.com/SaltBeerFactory",
    color: "#64748b" // slate
  },
  "Sibeeria": {
    name: "Sibeeria",
    slug: "sibeeria",
    url: "https://untappd.com/sibeeria",
    color: "#0ea5e9" // sky
  },
  "Sisters Brewery": {
    name: "Sisters Brewery",
    slug: "SistersBrouwerij",
    url: "https://untappd.com/SistersBrouwerij",
    color: "#d946ef" // fuchsia
  },
  "Struise Brouwers": {
    name: "Struise Brouwers",
    slug: "StruiseBrouwers",
    url: "https://untappd.com/StruiseBrouwers",
    color: "#84cc16" // lime
  },
  "Totenhopfen": {
    name: "Totenhopfen",
    slug: "totenhopfen",
    url: "https://untappd.com/totenhopfen",
    color: "#1e293b" // dark slate
  },
  "Vocation Brewery": {
    name: "Vocation Brewery",
    slug: "VocationBrewery",
    url: "https://untappd.com/VocationBrewery",
    color: "#0f766e" // teal dark
  }
};

// Get initials from brewery name
export function getBreweryInitials(name: string): string {
  const words = name.split(/\s+/).filter(w => !['&', 'the', 'de', 'van'].includes(w.toLowerCase()));
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// Get brewery info, with fallback
export function getBreweryInfo(name: string): Brewery {
  return BREWERIES[name] || {
    name,
    slug: name.replace(/\s+/g, ''),
    url: `https://untappd.com/search?q=${encodeURIComponent(name)}&type=brewery`,
    color: '#6b7280' // gray fallback
  };
}
