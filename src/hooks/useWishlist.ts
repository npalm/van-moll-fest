import { useState, useEffect, useCallback } from 'react';

const WISHLIST_KEY = 'vanmoll-wishlist';
const TASTED_KEY = 'vanmoll-tasted';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(WISHLIST_KEY);
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

  const [tastedList, setTastedList] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(TASTED_KEY);
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
    localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(TASTED_KEY, JSON.stringify([...tastedList]));
  }, [tastedList]);

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

  const toggleTasted = useCallback((beerId: number) => {
    setTastedList((prev) => {
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
  const hasTasted = useCallback((beerId: number) => tastedList.has(beerId), [tastedList]);

  const clearWishlist = useCallback(() => {
    setWishlist(new Set());
  }, []);

  const clearTastedList = useCallback(() => {
    setTastedList(new Set());
  }, []);

  return {
    wishlist,
    tastedList,
    wishlistCount: wishlist.size,
    tastedCount: tastedList.size,
    toggleWishlist,
    toggleTasted,
    isInWishlist,
    hasTasted,
    clearWishlist,
    clearTastedList,
  };
}
