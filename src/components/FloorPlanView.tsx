import type { BreweryGroup } from '../types/beer';
import { getBreweryInfo } from '../data/breweries';
import { BreweryLogo } from './BreweryLogo';

interface FloorPlanViewProps {
  breweryGroups: BreweryGroup[];
}

export function FloorPlanView({ breweryGroups }: FloorPlanViewProps) {
  // Group breweries by floor
  const floor1Breweries = breweryGroups.filter((group) => {
    const breweryInfo = getBreweryInfo(group.brewery);
    return breweryInfo.floor === 1;
  });

  const floor2Breweries = breweryGroups.filter((group) => {
    const breweryInfo = getBreweryInfo(group.brewery);
    return breweryInfo.floor === 2;
  });

  return (
    <div className="space-y-8">
      {/* Floor 1 */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">First Floor</h2>

        {/* Floor plan image */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          <img src="/floorplans/first-floor.png" alt="First Floor Plan" className="w-full h-auto" />
        </div>

        {/* Brewery list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {floor1Breweries.map((group) => {
            const breweryInfo = getBreweryInfo(group.brewery);
            return (
              <a
                key={group.brewery}
                href={breweryInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BreweryLogo brewery={group.brewery} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors truncate">
                      {group.brewery}
                    </h3>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors flex-shrink-0"
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
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {group.beers.length} {group.beers.length === 1 ? 'beer' : 'beers'}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      {/* Floor 2 */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Second Floor</h2>

        {/* Floor plan image */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          <img
            src="/floorplans/second-floor.png"
            alt="Second Floor Plan"
            className="w-full h-auto"
          />
        </div>

        {/* Brewery list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {floor2Breweries.map((group) => {
            const breweryInfo = getBreweryInfo(group.brewery);
            return (
              <a
                key={group.brewery}
                href={breweryInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BreweryLogo brewery={group.brewery} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors truncate">
                      {group.brewery}
                    </h3>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors flex-shrink-0"
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
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {group.beers.length} {group.beers.length === 1 ? 'beer' : 'beers'}
                </p>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
