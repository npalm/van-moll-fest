import { useState, useEffect, useCallback } from 'react';
import type { BeersData } from '../types/beer';
import beersData from '../data/beers.json';

const WISHLIST_KEY = 'vanmoll-wishlist';
const TASTED_KEY = 'vanmoll-tasted';

// Get valid beer IDs from the bundled data
const validBeerIds = new Set<number | null>((beersData as BeersData).beers.map((beer) => beer.id));

function loadFromStorage(key: string): Set<number> {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const ids = JSON.parse(stored) as number[];
        // Filter out invalid IDs immediately when loading
        return new Set(ids.filter((id) => validBeerIds.has(id)));
      }
    } catch {
      // Invalid data, start fresh
    }
  }
  return new Set();
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Set<number>>(() => loadFromStorage(WISHLIST_KEY));
  const [tastedList, setTastedList] = useState<Set<number>>(() => loadFromStorage(TASTED_KEY));

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

  const resetAll = useCallback(() => {
    setWishlist(new Set());
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
    resetAll,
  };
}
