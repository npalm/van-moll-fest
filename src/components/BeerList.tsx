import type { Beer, BreweryGroup } from '../types/beer';
import { BeerCard } from './BeerCard';
import { BreweryLogo } from './BreweryLogo';
import { getBreweryInfo } from '../data/breweries';

interface BeerListProps {
  beers: Beer[];
  breweryGroups: BreweryGroup[];
  isGroupedView: boolean;
  isInWishlist: (id: number) => boolean;
  hasTasted: (id: number) => boolean;
  onToggleWishlist: (id: number) => void;
  onToggleTasted: (id: number) => void;
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
      <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No beers found</h3>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Try adjusting your search or filters
      </p>
    </div>
  );
}

interface BeerGridProps {
  beers: Beer[];
  isInWishlist: (id: number) => boolean;
  hasTasted: (id: number) => boolean;
  onToggleWishlist: (id: number) => void;
  onToggleTasted: (id: number) => void;
  showBrewery?: boolean;
}

function BeerGrid({
  beers,
  isInWishlist,
  hasTasted,
  onToggleWishlist,
  onToggleTasted,
  showBrewery = false,
}: BeerGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {beers.map((beer) => (
        <BeerCard
          key={beer.id}
          beer={beer}
          isInWishlist={isInWishlist(beer.id)}
          hasTasted={hasTasted(beer.id)}
          onToggleWishlist={onToggleWishlist}
          onToggleTasted={onToggleTasted}
          showBrewery={showBrewery}
        />
      ))}
    </div>
  );
}

export function BeerList({
  beers,
  breweryGroups,
  isGroupedView,
  isInWishlist,
  hasTasted,
  onToggleWishlist,
  onToggleTasted,
}: BeerListProps) {
  if (isGroupedView ? breweryGroups.length === 0 : beers.length === 0) {
    return <EmptyState />;
  }

  // Grouped view by brewery
  if (isGroupedView) {
    return (
      <div className="space-y-10">
        {breweryGroups.map((group) => {
          const breweryInfo = getBreweryInfo(group.brewery);
          return (
            <section key={group.brewery} className="relative">
              {/* Brewery header */}
              <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-200 dark:border-slate-700">
                <a
                  href={breweryInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <BreweryLogo brewery={group.brewery} size="lg" />
                </a>
                <div className="flex-1">
                  <a
                    href={breweryInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                      {group.brewery}
                      <svg
                        className="inline-block w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    </h2>
                  </a>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {group.beers.length} {group.beers.length === 1 ? 'beer' : 'beers'} available
                  </p>
                </div>
              </div>
              <BeerGrid
                beers={group.beers}
                isInWishlist={isInWishlist}
                hasTasted={hasTasted}
                onToggleWishlist={onToggleWishlist}
                onToggleTasted={onToggleTasted}
              />
            </section>
          );
        })}
      </div>
    );
  }

  // Flat list view
  return (
    <BeerGrid
      beers={beers}
      isInWishlist={isInWishlist}
      hasTasted={hasTasted}
      onToggleWishlist={onToggleWishlist}
      onToggleTasted={onToggleTasted}
      showBrewery={true}
    />
  );
}
