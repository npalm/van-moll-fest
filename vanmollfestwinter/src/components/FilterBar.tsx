import type { SortOption, RatingFilter } from '../types/beer';

interface FilterBarProps {
  styles: string[];
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  selectedRating: RatingFilter;
  onRatingChange: (rating: RatingFilter) => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  showWishlistOnly: boolean;
  onWishlistToggle: (show: boolean) => void;
  wishlistCount: number;
}

const RATING_OPTIONS: { value: RatingFilter; label: string }[] = [
  { value: 'all', label: 'All Ratings' },
  { value: '4.0', label: '4.0+' },
  { value: '3.75', label: '3.75+' },
  { value: '3.5', label: '3.5+' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'brewery-grouped', label: 'By Brewery' },
  { value: 'order', label: 'List Order' },
  { value: 'rating', label: 'Rating' },
  { value: 'abv', label: 'ABV' },
  { value: 'brewery', label: 'Brewery A-Z' },
  { value: 'name', label: 'Name A-Z' },
];

export function FilterBar({
  styles,
  selectedStyle,
  onStyleChange,
  selectedRating,
  onRatingChange,
  selectedSort,
  onSortChange,
  showWishlistOnly,
  onWishlistToggle,
  wishlistCount,
}: FilterBarProps) {
  const selectClass =
    'px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent';

  return (
    <div className="flex flex-wrap gap-3">
      {/* Style filter */}
      <select
        value={selectedStyle}
        onChange={(e) => onStyleChange(e.target.value)}
        className={selectClass}
      >
        <option value="">All Styles</option>
        {styles.map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>

      {/* Rating filter */}
      <select
        value={selectedRating}
        onChange={(e) => onRatingChange(e.target.value as RatingFilter)}
        className={selectClass}
      >
        {RATING_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className={selectClass}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Wishlist toggle */}
      <button
        onClick={() => onWishlistToggle(!showWishlistOnly)}
        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
          showWishlistOnly
            ? 'bg-amber-500 border-amber-500 text-white'
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500 dark:hover:border-amber-500'
        }`}
      >
        <svg
          className={`w-4 h-4 ${showWishlistOnly ? 'text-white' : 'text-amber-500'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
        Wishlist ({wishlistCount})
      </button>
    </div>
  );
}
