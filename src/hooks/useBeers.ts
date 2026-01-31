import { useState, useMemo } from 'react';
import type {
  Beer,
  BeersData,
  FilterState,
  SortOption,
  RatingFilter,
  TastedFilter,
  BreweryGroup,
} from '../types/beer';

// Import beer data directly - bundled at build time
import beersData from '../data/beers.json';

interface UseBeersResult {
  beers: Beer[];
  filteredBeers: Beer[];
  breweryGroups: BreweryGroup[];
  styles: string[];
  breweries: string[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  filters: FilterState;
  setSearch: (search: string) => void;
  setStyles: (styles: string[]) => void;
  toggleStyle: (style: string) => void;
  setRating: (rating: RatingFilter) => void;
  setSort: (sort: SortOption) => void;
  setShowWishlistOnly: (show: boolean) => void;
  setTastedFilter: (filter: TastedFilter) => void;
  isGroupedView: boolean;
}

// Helper function to get sortable brewery name by removing articles
function getBrewerySortKey(brewery: string): string {
  const lower = brewery.toLowerCase();
  // Remove leading articles (the, de, van, het, 't, etc.)
  const articles = ['the ', 'de ', 'van ', 'het ', "'t ", "de'", "het'"];
  for (const article of articles) {
    if (lower.startsWith(article)) {
      return brewery.substring(article.length).trim();
    }
  }
  return brewery;
}

export function useBeers(wishlist: Set<number>, tastedList: Set<number>): UseBeersResult {
  // Data is loaded at build time, no fetching needed
  const [beers] = useState<Beer[]>((beersData as BeersData).beers);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [lastUpdated] = useState<string | null>((beersData as BeersData).lastUpdated);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    styles: [],
    rating: 'all',
    sort: 'brewery-grouped',
    showWishlistOnly: false,
    tastedFilter: 'all',
  });

  // Extract unique styles
  const styles = useMemo(() => {
    const uniqueStyles = [...new Set(beers.map((b) => b.style))];
    return uniqueStyles.sort();
  }, [beers]);

  // Extract unique breweries
  const breweries = useMemo(() => {
    const uniqueBreweries = [...new Set(beers.map((b) => b.brewery))];
    return uniqueBreweries.sort((a, b) => getBrewerySortKey(a).localeCompare(getBrewerySortKey(b)));
  }, [beers]);

  // Filter and sort beers
  const filteredBeers = useMemo(() => {
    let result = [...beers];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (beer) =>
          beer.name.toLowerCase().includes(searchLower) ||
          beer.brewery.toLowerCase().includes(searchLower)
      );
    }

    // Style filter (multiple styles)
    if (filters.styles.length > 0) {
      result = result.filter((beer) => filters.styles.includes(beer.style));
    }

    // Rating filter
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      result = result.filter((beer) => beer.rating !== null && beer.rating >= minRating);
    }

    // Wishlist filter
    if (filters.showWishlistOnly) {
      result = result.filter((beer) => wishlist.has(beer.id));
    }

    // Tasted filter
    if (filters.tastedFilter === 'tasted') {
      result = result.filter((beer) => tastedList.has(beer.id));
    } else if (filters.tastedFilter === 'untasted') {
      result = result.filter((beer) => !tastedList.has(beer.id));
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'brewery-grouped': {
          // Sort by brewery first (ignoring articles), then by beer name within brewery
          const breweryCompare = getBrewerySortKey(a.brewery).localeCompare(
            getBrewerySortKey(b.brewery)
          );
          if (breweryCompare !== 0) return breweryCompare;
          return a.name.localeCompare(b.name);
        }
        case 'rating':
          // Null ratings go to the end
          if (a.rating === null && b.rating === null) return 0;
          if (a.rating === null) return 1;
          if (b.rating === null) return -1;
          return b.rating - a.rating;
        case 'abv':
          return b.abv - a.abv;
        case 'brewery':
          return getBrewerySortKey(a.brewery).localeCompare(getBrewerySortKey(b.brewery));
        case 'name':
          return a.name.localeCompare(b.name);
        case 'order':
        default:
          return a.order - b.order;
      }
    });

    return result;
  }, [beers, filters, wishlist, tastedList]);

  // Group beers by brewery (for grouped view)
  const breweryGroups = useMemo((): BreweryGroup[] => {
    if (filters.sort !== 'brewery-grouped') return [];

    const groups = new Map<string, Beer[]>();
    for (const beer of filteredBeers) {
      const existing = groups.get(beer.brewery) || [];
      existing.push(beer);
      groups.set(beer.brewery, existing);
    }

    return Array.from(groups.entries())
      .map(([brewery, beers]) => ({ brewery, beers }))
      .sort((a, b) => getBrewerySortKey(a.brewery).localeCompare(getBrewerySortKey(b.brewery)));
  }, [filteredBeers, filters.sort]);

  const isGroupedView = filters.sort === 'brewery-grouped';

  // Filter setters
  const setSearch = (search: string) => setFilters((prev) => ({ ...prev, search }));
  const setStyles = (styles: string[]) => setFilters((prev) => ({ ...prev, styles }));
  const toggleStyle = (style: string) =>
    setFilters((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));
  const setRating = (rating: RatingFilter) => setFilters((prev) => ({ ...prev, rating }));
  const setSort = (sort: SortOption) => setFilters((prev) => ({ ...prev, sort }));
  const setShowWishlistOnly = (showWishlistOnly: boolean) =>
    setFilters((prev) => ({ ...prev, showWishlistOnly }));
  const setTastedFilter = (tastedFilter: TastedFilter) =>
    setFilters((prev) => ({ ...prev, tastedFilter }));

  return {
    beers,
    filteredBeers,
    breweryGroups,
    styles,
    breweries,
    loading,
    error,
    lastUpdated,
    filters,
    setSearch,
    setStyles,
    toggleStyle,
    setRating,
    setSort,
    setShowWishlistOnly,
    setTastedFilter,
    isGroupedView,
  };
}
