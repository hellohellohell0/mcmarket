'use client';

import { useState, useEffect } from 'react';
import styles from './FilterSidebar.module.css';

interface FilterProps {
    onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterProps) {
    const [minLen, setMinLen] = useState<number | ''>('');
    const [maxLen, setMaxLen] = useState<number | ''>('');
    const [capes, setCapes] = useState<string[]>([]);
    const [sort, setSort] = useState('date_new');
    const [countType, setCountType] = useState('both');

    const availableCapes = ['Common', 'Pan', 'Purple Heart'];

    const handleCapeToggle = (cape: string) => {
        setCapes(prev =>
            prev.includes(cape) ? prev.filter(c => c !== cape) : [...prev, cape]
        );
    };

    useEffect(() => {
        onFilterChange({
            minLen,
            maxLen,
            capes,
            sort,
            countType
        });
    }, [minLen, maxLen, capes, sort, countType, onFilterChange]);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.section}>
                <h3 className={styles.heading}>Sort By</h3>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.select}>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="date_new">Date: Recent</option>
                    <option value="date_old">Date: Oldest</option>
                </select>
            </div>

            <div className={styles.section}>
                <h3 className={styles.heading}>Username Length</h3>
                <div className={styles.row}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={minLen}
                        onChange={e => setMinLen(e.target.value ? parseInt(e.target.value) : '')}
                        className={styles.input}
                    />
                    <span className={styles.separator}>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxLen}
                        onChange={e => setMaxLen(e.target.value ? parseInt(e.target.value) : '')}
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.heading}>Capes</h3>
                <div className={styles.checkboxGroup}>
                    {availableCapes.map(cape => (
                        <label key={cape} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={capes.includes(cape)}
                                onChange={() => handleCapeToggle(cape)}
                            />
                            <span>{cape}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.heading}>Price Type</h3>
                <select value={countType} onChange={e => setCountType(e.target.value)} className={styles.select}>
                    <option value="both">Both</option>
                    <option value="offers">Current Offers</option>
                    <option value="bins">BINs Only</option>
                </select>
            </div>
        </aside>
    );
}
