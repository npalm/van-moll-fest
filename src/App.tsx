import { useTheme } from './hooks/useTheme';
import { useWishlist } from './hooks/useWishlist';
import { useBeers } from './hooks/useBeers';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { BeerList } from './components/BeerList';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const { wishlist, wishlistCount, toggleWishlist, isInWishlist } = useWishlist();
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
    isGroupedView,
  } = useBeers(wishlist);

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
            onToggleWishlist={toggleWishlist}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
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
      </footer>
    </div>
  );
}

export default App;
