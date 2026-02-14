'use client';

import { useState, useEffect } from 'react';
import styles from './FilterSidebar.module.css';

interface FilterProps {
    onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterProps) {
    const [minLen, setMinLen] = useState<number | ''>('');
    const [maxLen, setMaxLen] = useState<number | ''>('');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [capes, setCapes] = useState<string[]>([]);
    const [accountTypes, setAccountTypes] = useState<string[]>([]);
    const [maxNameChanges, setMaxNameChanges] = useState<number>(15);
    const [sort, setSort] = useState('date_new');
    const [countType, setCountType] = useState('both');
    const [isOpen, setIsOpen] = useState(false); // Mobile toggle

    // Collapsable sections state
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
        sort: false,
        price: false,
        priceType: false,
        accountType: false,
        nameChanges: false,
        length: false,
        capes: true // Start capes collapsed as it's long
    });

    const toggleSection = (section: string) => {
        setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const availableCapes = [
        '15th Anniversary', 'Cherry Blossom', 'Common', 'Copper', "Follower's", "Founder's",
        'Home', 'MCC 15Tth Year', 'Menace', 'Migrator', 'MineCon 2011', 'MineCon 2012',
        'MineCon 2013', 'MineCon 2015', 'MineCon 2016', 'Minecraft Experience',
        'Mojang Office', 'Pan', 'Purple Heart', 'Realms Mapmaker', 'Translator',
        'Vanilla', 'Yearn', 'Zombie Horse'
    ];
    const accountTypeOptions = ['High Tier', 'OG', 'Semi-OG', 'Low Tier', 'Minecon', 'Stats', 'Caped', 'Other'];

    const handleCapeToggle = (cape: string) => {
        setCapes(prev =>
            prev.includes(cape) ? prev.filter(c => c !== cape) : [...prev, cape]
        );
    };

    const handleAccountTypeToggle = (type: string) => {
        setAccountTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    useEffect(() => {
        onFilterChange({
            minLen,
            maxLen,
            minPrice,
            maxPrice,
            capes,
            accountTypes,
            maxNameChanges, // 15 means 15+ (all)
            sort,
            countType
        });
    }, [minLen, maxLen, minPrice, maxPrice, capes, accountTypes, maxNameChanges, sort, countType, onFilterChange]);

    const SectionHeading = ({ title, section, isCollapsed }: { title: string, section: string, isCollapsed: boolean }) => (
        <div className={styles.headingWrapper} onClick={() => toggleSection(section)}>
            <h3 className={styles.heading}>{title}</h3>
            <span className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ''}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </span>
        </div>
    );

    return (
        <aside className={styles.sidebar}>
            <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                <span>Filters</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>

            <div className={`${styles.filtersContent} ${isOpen ? styles.open : ''}`}>
                <div className={styles.section}>
                    <SectionHeading title="Sort By" section="sort" isCollapsed={collapsed.sort} />
                    <div className={`${styles.sectionContent} ${collapsed.sort ? styles.collapsed : ''}`}>
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.select}>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="date_new">Date: Recent</option>
                            <option value="date_old">Date: Oldest</option>
                        </select>
                    </div>
                </div>

                <div className={styles.section}>
                    <SectionHeading title="Price Range" section="price" isCollapsed={collapsed.price} />
                    <div className={`${styles.sectionContent} ${collapsed.price ? styles.collapsed : ''}`}>
                        <div className={styles.row}>
                            <input
                                type="number"
                                placeholder="Min $"
                                value={minPrice}
                                onChange={e => setMinPrice(e.target.value ? parseFloat(e.target.value) : '')}
                                className={styles.input}
                            />
                            <span className={styles.separator}>-</span>
                            <input
                                type="number"
                                placeholder="Max $"
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value ? parseFloat(e.target.value) : '')}
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <SectionHeading title="Price Type" section="priceType" isCollapsed={collapsed.priceType} />
                    <div className={`${styles.sectionContent} ${collapsed.priceType ? styles.collapsed : ''}`}>
                        <select value={countType} onChange={e => setCountType(e.target.value)} className={styles.select}>
                            <option value="both">Both</option>
                            <option value="offers">Current Offers</option>
                            <option value="bins">BINs Only</option>
                        </select>
                    </div>
                </div>

                <div className={styles.section}>
                    <SectionHeading title="Account Type" section="accountType" isCollapsed={collapsed.accountType} />
                    <div className={`${styles.sectionContent} ${collapsed.accountType ? styles.collapsed : ''}`}>
                        <div className={styles.checkboxGroup}>
                            {accountTypeOptions.map(type => (
                                <label key={type} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={accountTypes.includes(type)}
                                        onChange={() => handleAccountTypeToggle(type)}
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <SectionHeading title="Name Changes" section="nameChanges" isCollapsed={collapsed.nameChanges} />
                    <div className={`${styles.sectionContent} ${collapsed.nameChanges ? styles.collapsed : ''}`}>
                        <div className={styles.sliderContainer}>
                            <label className={styles.sliderLabel}>
                                Max: {maxNameChanges === 0 ? 'Prename' : maxNameChanges >= 15 ? '15+' : maxNameChanges}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="15"
                                value={maxNameChanges}
                                onChange={e => setMaxNameChanges(parseInt(e.target.value))}
                                className={styles.range}
                                style={{
                                    background: `linear-gradient(to right, var(--slider-fill) ${(maxNameChanges / 15) * 100}%, var(--slider-track) ${(maxNameChanges / 15) * 100}%)`
                                }}
                            />
                            <div className={styles.rangeLabels}>
                                <span>0</span>
                                <span>15+</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <SectionHeading title="Username Length" section="length" isCollapsed={collapsed.length} />
                    <div className={`${styles.sectionContent} ${collapsed.length ? styles.collapsed : ''}`}>
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
                </div>

                <div className={styles.section}>
                    <SectionHeading title="Capes" section="capes" isCollapsed={collapsed.capes} />
                    <div className={`${styles.sectionContent} ${collapsed.capes ? styles.collapsed : ''}`}>
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
                </div>
            </div>
        </aside>
    );
}
