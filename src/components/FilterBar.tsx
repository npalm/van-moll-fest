import type { SortOption, RatingFilter, TastedFilter } from '../types/beer';
import { StyleTagFilter } from './StyleTagFilter';

interface FilterBarProps {
  styles: string[];
  selectedStyles: string[];
  onToggleStyle: (style: string) => void;
  onClearStyles: () => void;
  selectedRating: RatingFilter;
  onRatingChange: (rating: RatingFilter) => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  showWishlistOnly: boolean;
  onWishlistToggle: (show: boolean) => void;
  wishlistCount: number;
  tastedFilter: TastedFilter;
  onTastedFilterChange: (filter: TastedFilter) => void;
  tastedCount: number;
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
  selectedStyles,
  onToggleStyle,
  onClearStyles,
  selectedRating,
  onRatingChange,
  selectedSort,
  onSortChange,
  showWishlistOnly,
  onWishlistToggle,
  wishlistCount,
  tastedFilter,
  onTastedFilterChange,
  tastedCount,
}: FilterBarProps) {
  const selectClass =
    'px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent';

  return (
    <div className="flex flex-wrap gap-3 items-start">
      {/* Style filter (multi-select tags) */}
      <StyleTagFilter
        styles={styles}
        selectedStyles={selectedStyles}
        onToggleStyle={onToggleStyle}
        onClearStyles={onClearStyles}
      />

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
            ? 'bg-red-500 border-red-500 text-white'
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-500 dark:hover:border-red-500'
        }`}
      >
        <svg
          className={`w-4 h-4 ${showWishlistOnly ? 'text-white' : 'text-red-500'}`}
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

      {/* Tasted filter */}
      {tastedCount > 0 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTastedFilterChange(tastedFilter === 'tasted' ? 'all' : 'tasted')}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
              tastedFilter === 'tasted'
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500 dark:hover:border-amber-500'
            }`}
            title="Show only tasted beers"
          >
            <svg
              className={`w-4 h-4 ${tastedFilter === 'tasted' ? 'text-white' : 'text-amber-500'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 3h12v2c0 1-.5 2-1.5 2.5.5.5 1 1.5 1 2.5v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8c0-1 .5-2 1-2.5C4.5 7 4 6 4 5V3zm12 5h3a2 2 0 012 2v4a2 2 0 01-2 2h-3v-8z" />
            </svg>
            Tasted ({tastedCount})
          </button>
          <button
            onClick={() => onTastedFilterChange(tastedFilter === 'untasted' ? 'all' : 'untasted')}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
              tastedFilter === 'untasted'
                ? 'bg-slate-500 border-slate-500 text-white'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-500 dark:hover:border-slate-500'
            }`}
            title="Hide tasted beers"
          >
            <svg
              className={`w-4 h-4 ${tastedFilter === 'untasted' ? 'text-white' : 'text-slate-500'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            Hide tasted
          </button>
        </div>
      )}
    </div>
  );
}
