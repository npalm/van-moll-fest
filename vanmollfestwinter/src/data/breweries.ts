// Brewery data with logos (fetched from Untappd at build time)
import breweryLogos from './brewery_logos.json';

export interface Brewery {
  name: string;
  slug: string;
  url: string;
  logo: string | null;
  color: string;
}

// Fallback colors for placeholder logos
const BREWERY_COLORS: Record<string, string> = {
  "CRAK": "#f97316",
  "The Garden Brewery": "#22c55e",
  "Lost Brewing": "#3b82f6",
  "Maisel & Friends": "#eab308",
  "Bayreuther": "#dc2626",
  "Mederij Marcus": "#f59e0b",
  "De Moersleutel": "#8b5cf6",
  "Van Moll": "#ef4444",
  "Moon Lark": "#6366f1",
  "Prizm Brewing": "#ec4899",
  "Salikatt": "#14b8a6",
  "Salt Beer Factory": "#64748b",
  "Sibeeria": "#0ea5e9",
  "Sisters Brewery": "#d946ef",
  "Struise Brouwers": "#84cc16",
  "Totenhopfen": "#1e293b",
  "Vocation Brewery": "#0f766e",
};

// Get initials from brewery name
export function getBreweryInitials(name: string): string {
  const words = name.split(/\s+/).filter(w => !['&', 'the', 'de', 'van'].includes(w.toLowerCase()));
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// Get brewery info with logo
export function getBreweryInfo(name: string): Brewery {
  const logoData = (breweryLogos as Record<string, { slug: string; url: string; logo: string }>)[name];
  
  if (logoData) {
    return {
      name,
      slug: logoData.slug,
      url: logoData.url,
      logo: logoData.logo,
      color: BREWERY_COLORS[name] || '#6b7280',
    };
  }
  
  // Fallback for unknown breweries
  return {
    name,
    slug: name.replace(/\s+/g, ''),
    url: `https://untappd.com/search?q=${encodeURIComponent(name)}&type=brewery`,
    logo: null,
    color: BREWERY_COLORS[name] || '#6b7280',
  };
}
