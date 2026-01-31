import { useTheme } from './hooks/useTheme';
import { useWishlist } from './hooks/useWishlist';
import { useBeers } from './hooks/useBeers';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { BeerList } from './components/BeerList';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const {
    wishlist,
    tastedList,
    wishlistCount,
    tastedCount,
    toggleWishlist,
    toggleTasted,
    isInWishlist,
    hasTasted,
  } = useWishlist();
  const {
    beers,
    filteredBeers,
    breweryGroups,
    styles,
    loading,
    error,
    filters,
    setSearch,
    setStyles,
    toggleStyle,
    setRating,
    setSort,
    setShowWishlistOnly,
    setHideTasted,
    isGroupedView,
  } = useBeers(wishlist, tastedList);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            Error loading beers
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        beerCount={filteredBeers.length}
        totalCount={beers.length}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and filters */}
        <div className="space-y-4 mb-6">
          <SearchBar value={filters.search} onChange={setSearch} />
          <FilterBar
            styles={styles}
            selectedStyles={filters.styles}
            onToggleStyle={toggleStyle}
            onClearStyles={() => setStyles([])}
            selectedRating={filters.rating}
            onRatingChange={setRating}
            selectedSort={filters.sort}
            onSortChange={setSort}
            showWishlistOnly={filters.showWishlistOnly}
            onWishlistToggle={setShowWishlistOnly}
            wishlistCount={wishlistCount}
            hideTasted={filters.hideTasted}
            onHideTastedToggle={setHideTasted}
            tastedCount={tastedCount}
          />
        </div>

        {/* Beer list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
          </div>
        ) : (
          <BeerList
            beers={filteredBeers}
            breweryGroups={breweryGroups}
            isGroupedView={isGroupedView}
            isInWishlist={isInWishlist}
            hasTasted={hasTasted}
            onToggleWishlist={toggleWishlist}
            onToggleTasted={toggleTasted}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-slate-500 dark:text-slate-400 space-y-2">
          <div>
            Data from{' '}
            <a
              href="https://untappd.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-500 hover:underline"
            >
              Untappd
            </a>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://vanmollfest.com/nl/van-moll-fest-2026-winter/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-500 hover:underline"
            >
              Van Moll Fest Winter 2026
            </a>
            <span>•</span>
            <a
              href="https://github.com/npalm/van-moll-fest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-500 hover:underline inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            All data stored locally. Privacy first.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
