'use client';

import { useState, useEffect, useCallback } from 'react';
import FilterSidebar from '@/components/Marketplace/FilterSidebar';
import AccountCard from '@/components/Marketplace/AccountCard';
import styles from './page.module.css';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const [search, setSearch] = useState('');
  
  const [visibleLimit, setVisibleLimit] = useState(12);
  const [visualsLoadedCount, setVisualsLoadedCount] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.minLen) params.set('minLen', filters.minLen.toString());
      if (filters.maxLen) params.set('maxLen', filters.maxLen.toString());
      if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
      if (filters.maxNameChanges !== undefined) params.set('maxNameChanges', filters.maxNameChanges.toString());
      if (filters.sort) params.set('sort', filters.sort);
      if (filters.countType) params.set('countType', filters.countType);

      if (filters.capes && filters.capes.length > 0) {
        filters.capes.forEach((c: string) => params.append('capes', c));
      }
      if (filters.accountTypes && filters.accountTypes.length > 0) {
        filters.accountTypes.forEach((t: string) => params.append('accountType', t));
      }

      if (search) {
        params.set('search', search);
      }

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setListings(data.listings || []);
      setVisibleLimit(12);
      setVisualsLoadedCount(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  useEffect(() => {
    // Debounce basic implementation or rely on strict filters
    const timer = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchListings]);

  // Staggered Visual Loading Queue
  useEffect(() => {
    if (loading || listings.length === 0) return;
    
    // Only load visuals up to what is currently visible on the page
    const targetCount = Math.min(listings.length, visibleLimit);
    if (visualsLoadedCount >= targetCount) return;

    const timer = setTimeout(() => {
      setVisualsLoadedCount(prev => prev + 1);
    }, 100); // 100ms staggering delay between each 3D viewer initialization

    return () => clearTimeout(timer);
  }, [visualsLoadedCount, visibleLimit, listings.length, loading]);

  const loadMore = () => {
    setVisibleLimit(prev => Math.min(prev + 12, listings.length));
  };

  return (
    <div className={`container ${styles.pageContainer}`}>
      <FilterSidebar onFilterChange={setFilters} />

      <div className={styles.gridContainer}>
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchBar}
          />
        </div>

        <div className={styles.header}>
          <h2>Minecraft Accounts</h2>
          <span className={styles.count}>{listings.length} accounts found</span>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading accounts...</div>
        ) : listings.length > 0 ? (
          <>
            <div className={styles.grid}>
              {listings.slice(0, visibleLimit).map((l: any, index: number) => (
                <AccountCard key={l.id} listing={l} loadVisuals={index < visualsLoadedCount} />
              ))}
            </div>
            
            {visibleLimit < listings.length && (
              <div className={styles.loadMoreWrapper}>
                <button onClick={loadMore} className={styles.loadMoreBtn}>
                  Load More Accounts
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.empty}>No accounts found matching your filters.</div>
        )}
      </div>
    </div>
  );
}
