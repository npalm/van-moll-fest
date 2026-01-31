import type { Beer } from '../types/beer';
import { BreweryLogo } from './BreweryLogo';

interface BeerCardProps {
  beer: Beer;
  isInWishlist: boolean;
  hasTasted: boolean;
  onToggleWishlist: (id: number) => void;
  onToggleTasted: (id: number) => void;
  showBrewery?: boolean;
}

export function BeerCard({
  beer,
  isInWishlist,
  hasTasted,
  onToggleWishlist,
  onToggleTasted,
  showBrewery = false,
}: BeerCardProps) {
  const ratingColor =
    beer.rating === null
      ? 'text-slate-400'
      : beer.rating >= 4.0
        ? 'text-green-500'
        : beer.rating >= 3.5
          ? 'text-amber-500'
          : 'text-slate-500';

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col hover:shadow-md transition-shadow ${hasTasted ? 'opacity-60' : ''}`}
    >
      {/* Header with name and action buttons */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-3 min-w-0">
          {showBrewery && (
            <BreweryLogo brewery={beer.brewery} size="sm" className="flex-shrink-0 mt-0.5" />
          )}
          <div className="min-w-0">
            <h3
              className={`font-semibold text-slate-900 dark:text-white leading-tight ${hasTasted ? 'line-through decoration-2' : ''}`}
            >
              {beer.name}
            </h3>
            {showBrewery && (
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{beer.brewery}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Tasted button (beer mug) */}
          <button
            onClick={() => onToggleTasted(beer.id)}
            className="p-1 -m-1 rounded transition-colors"
            aria-label={hasTasted ? 'Mark as not tasted' : 'Mark as tasted'}
            title={hasTasted ? 'Mark as not tasted' : 'Mark as tasted'}
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                hasTasted
                  ? 'text-amber-500'
                  : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
              }`}
              fill={hasTasted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={hasTasted ? 0 : 1.5}
              viewBox="0 0 24 24"
            >
              {/* Beer mug icon */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4h12v2c0 1-.5 2-1.5 2.5.5.5 1 1.5 1 2.5v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7c0-1 .5-2 1-2.5C4.5 8 4 7 4 6V4zm12 4h3a1 1 0 011 1v4a1 1 0 01-1 1h-3"
              />
              {hasTasted && (
                <>
                  {/* Foam */}
                  <ellipse cx="10" cy="6" rx="5" ry="1.5" />
                  {/* Beer liquid */}
                  <rect x="5" y="6" width="10" height="10" rx="1" />
                  {/* Handle */}
                  <path d="M15 8h2a1 1 0 011 1v4a1 1 0 01-1 1h-2" />
                </>
              )}
            </svg>
          </button>
          {/* Wishlist button (heart) */}
          <button
            onClick={() => onToggleWishlist(beer.id)}
            className="wishlist-btn p-1 -m-1 rounded transition-colors"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                isInWishlist
                  ? 'text-red-500'
                  : 'text-slate-300 dark:text-slate-600 hover:text-red-400'
              }`}
              fill={isInWishlist ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Style badge */}
      <span className="inline-block self-start px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mb-3">
        {beer.style}
      </span>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
        {/* ABV */}
        <div className="text-sm">
          <span className="text-slate-500 dark:text-slate-400">ABV</span>{' '}
          <span className="font-medium text-slate-900 dark:text-white">{beer.abv}%</span>
        </div>

        {/* Rating */}
        <div className="text-sm flex items-center gap-1">
          <svg className={`w-4 h-4 ${ratingColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className={`font-medium ${ratingColor}`}>
            {beer.rating !== null ? beer.rating.toFixed(2) : 'N/A'}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Untappd link */}
        {beer.untappdUrl && (
          <a
            href={beer.untappdUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-medium"
          >
            Untappd
            <svg
              className="inline-block w-3 h-3 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
