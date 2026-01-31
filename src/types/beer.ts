export interface Beer {
  id: number;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  rating: number | null;
  untappdUrl: string;
  order: number;
}

export interface BeersData {
  lastUpdated: string;
  beers: Beer[];
}

export type SortOption = 'brewery-grouped' | 'order' | 'rating' | 'abv' | 'brewery' | 'name';

export interface BreweryGroup {
  brewery: string;
  beers: Beer[];
}
export type RatingFilter = 'all' | '4.0' | '3.75' | '3.5';

export interface FilterState {
  search: string;
  styles: string[];
  rating: RatingFilter;
  sort: SortOption;
  showWishlistOnly: boolean;
}
