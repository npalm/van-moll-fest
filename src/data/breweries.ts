// Brewery data with logos (fetched from Untappd at build time)
import breweryLogos from './brewery_logos.json';

export interface Brewery {
  name: string;
  slug: string;
  url: string;
  logo: string | null;
  color: string;
  floor: number;
}

// Fallback colors for placeholder logos
const BREWERY_COLORS: Record<string, string> = {
  'CRAK Brewery': '#f97316',
  'The Garden Brewery': '#22c55e',
  'Lost Brewing': '#3b82f6',
  'Maisel & Friends': '#eab308',
  'Mederij Marcus': '#f59e0b',
  'De Moersleutel': '#8b5cf6',
  'Van Moll': '#ef4444',
  'Moon Lark': '#6366f1',
  'Prizm Brewing': '#ec4899',
  Salikatt: '#14b8a6',
  'Salt Beer Factory': '#64748b',
  Sibeeria: '#0ea5e9',
  'Sisters Brewery': '#d946ef',
  'Struise Brouwers': '#84cc16',
  Totenhopfen: '#1e293b',
  'Vocation Brewery': '#0f766e',
};

// Floor mappings for breweries
const BREWERY_FLOOR_MAP: Record<string, number> = {
  // Floor 1
  'CRAK Brewery': 1,
  Sibeeria: 1,
  Salikatt: 1,
  'Struise Brouwers': 1,
  'Maisel & Friends': 1,
  'De Moersleutel': 1,
  'Mederij Marcus': 1,
  'Moon Lark': 1,
  Totenhopfen: 1,

  // Floor 2
  'Lost Brewing': 2,
  'Vocation Brewery': 2,
  'The Garden Brewery': 2,
  'Van Moll': 2,
  'Sisters Brewery': 2,
  'Salt Beer Factory': 2,
  'Prizm Brewing': 2,
};

// Get initials from brewery name
export function getBreweryInitials(name: string): string {
  const words = name
    .split(/\s+/)
    .filter((w) => !['&', 'the', 'de', 'van'].includes(w.toLowerCase()));
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

// Get brewery info with logo
export function getBreweryInfo(name: string): Brewery {
  const logoData = (breweryLogos as Record<string, { slug: string; url: string; logo: string }>)[
    name
  ];

  const floor = BREWERY_FLOOR_MAP[name] || 1; // Default to floor 1 if not mapped

  if (logoData) {
    return {
      name,
      slug: logoData.slug,
      url: logoData.url,
      logo: logoData.logo,
      color: BREWERY_COLORS[name] || '#6b7280',
      floor,
    };
  }

  // Fallback for unknown breweries
  return {
    name,
    slug: name.replace(/\s+/g, ''),
    url: `https://untappd.com/search?q=${encodeURIComponent(name)}&type=brewery`,
    logo: null,
    color: BREWERY_COLORS[name] || '#6b7280',
    floor,
  };
}
