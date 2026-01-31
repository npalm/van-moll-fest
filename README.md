# Van Moll Fest Winter 2026 PWA

A Progressive Web App for the Van Moll Fest Winter 2026 beer festival.

## Features

- **Beer List**: 87 beers from 18 breweries with Untappd ratings
- **Search & Filter**: Search by name/brewery, filter by style and rating (4.0+, 3.75+, 3.5+)
- **Sorting**: Sort by brewery (grouped view), list order, rating, ABV, or name
- **Brewery Logos**: Real logos fetched from Untappd for all breweries
- **Wishlist**: Persisted to localStorage, toggle beers to try
- **Dark/Light Mode**: System preference detection with manual toggle
- **PWA**: Offline-capable with service worker, installable on mobile
- **Untappd Integration**: Direct links to each beer on Untappd

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS (dark mode default)
- vite-plugin-pwa for service worker
- ESLint + Prettier for code quality

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Format
npm run format
```

## Links

- [Van Moll Fest Winter 2026](https://vanmollfest.com/nl/van-moll-fest-2026-winter/)
- [GitHub Repository](https://github.com/npalm/van-moll-fest)
