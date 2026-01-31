import { useState, useMemo } from 'react';
import type {
  Beer,
  BeersData,
  FilterState,
  SortOption,
  RatingFilter,
  BreweryGroup,
} from '../types/beer';

// Import beer data directly - bundled at build time
import beersData from '../../public/beers.json';

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
  setStyle: (style: string) => void;
  setRating: (rating: RatingFilter) => void;
  setSort: (sort: SortOption) => void;
  setShowWishlistOnly: (show: boolean) => void;
  isGroupedView: boolean;
}

export function useBeers(wishlist: Set<number>): UseBeersResult {
  // Data is loaded at build time, no fetching needed
  const [beers] = useState<Beer[]>((beersData as BeersData).beers);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [lastUpdated] = useState<string | null>((beersData as BeersData).lastUpdated);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    style: '',
    rating: 'all',
    sort: 'brewery-grouped',
    showWishlistOnly: false,
  });

  // Extract unique styles
  const styles = useMemo(() => {
    const uniqueStyles = [...new Set(beers.map((b) => b.style))];
    return uniqueStyles.sort();
  }, [beers]);

  // Extract unique breweries
  const breweries = useMemo(() => {
    const uniqueBreweries = [...new Set(beers.map((b) => b.brewery))];
    return uniqueBreweries.sort();
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

    // Style filter
    if (filters.style) {
      result = result.filter((beer) => beer.style === filters.style);
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

    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'brewery-grouped': {
          // Sort by brewery first, then by beer name within brewery
          const breweryCompare = a.brewery.localeCompare(b.brewery);
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
          return a.brewery.localeCompare(b.brewery);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'order':
        default:
          return a.order - b.order;
      }
    });

    return result;
  }, [beers, filters, wishlist]);

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
      .sort((a, b) => a.brewery.localeCompare(b.brewery));
  }, [filteredBeers, filters.sort]);

  const isGroupedView = filters.sort === 'brewery-grouped';

  // Filter setters
  const setSearch = (search: string) => setFilters((prev) => ({ ...prev, search }));
  const setStyle = (style: string) => setFilters((prev) => ({ ...prev, style }));
  const setRating = (rating: RatingFilter) => setFilters((prev) => ({ ...prev, rating }));
  const setSort = (sort: SortOption) => setFilters((prev) => ({ ...prev, sort }));
  const setShowWishlistOnly = (showWishlistOnly: boolean) =>
    setFilters((prev) => ({ ...prev, showWishlistOnly }));

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
    setStyle,
    setRating,
    setSort,
    setShowWishlistOnly,
    isGroupedView,
  };
}
