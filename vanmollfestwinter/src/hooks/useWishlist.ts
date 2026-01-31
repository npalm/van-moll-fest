import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vanmoll-wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const ids = JSON.parse(stored) as number[];
          return new Set(ids);
        }
      } catch {
        // Invalid data, start fresh
      }
    }
    return new Set();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...wishlist]));
  }, [wishlist]);

  const toggleWishlist = useCallback((beerId: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(beerId)) {
        next.delete(beerId);
      } else {
        next.add(beerId);
      }
      return next;
    });
  }, []);

  const isInWishlist = useCallback((beerId: number) => wishlist.has(beerId), [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist(new Set());
  }, []);

  return {
    wishlist,
    wishlistCount: wishlist.size,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
}
