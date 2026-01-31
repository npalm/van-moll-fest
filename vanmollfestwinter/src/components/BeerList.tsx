import type { Beer, BreweryGroup } from '../types/beer';
import { BeerCard } from './BeerCard';

interface BeerListProps {
  beers: Beer[];
  breweryGroups: BreweryGroup[];
  isGroupedView: boolean;
  isInWishlist: (id: number) => boolean;
  onToggleWishlist: (id: number) => void;
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
        No beers found
      </h3>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Try adjusting your search or filters
      </p>
    </div>
  );
}

interface BeerGridProps {
  beers: Beer[];
  isInWishlist: (id: number) => boolean;
  onToggleWishlist: (id: number) => void;
}

function BeerGrid({ beers, isInWishlist, onToggleWishlist }: BeerGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {beers.map((beer) => (
        <BeerCard
          key={beer.id}
          beer={beer}
          isInWishlist={isInWishlist(beer.id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}

export function BeerList({ beers, breweryGroups, isGroupedView, isInWishlist, onToggleWishlist }: BeerListProps) {
  if (isGroupedView ? breweryGroups.length === 0 : beers.length === 0) {
    return <EmptyState />;
  }

  // Grouped view by brewery
  if (isGroupedView) {
    return (
      <div className="space-y-8">
        {breweryGroups.map((group) => (
          <section key={group.brewery}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {group.brewery}
              </h2>
              <span className="px-2 py-0.5 text-sm font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                {group.beers.length} {group.beers.length === 1 ? 'beer' : 'beers'}
              </span>
            </div>
            <BeerGrid
              beers={group.beers}
              isInWishlist={isInWishlist}
              onToggleWishlist={onToggleWishlist}
            />
          </section>
        ))}
      </div>
    );
  }

  // Flat list view
  return (
    <BeerGrid
      beers={beers}
      isInWishlist={isInWishlist}
      onToggleWishlist={onToggleWishlist}
    />
  );
}
