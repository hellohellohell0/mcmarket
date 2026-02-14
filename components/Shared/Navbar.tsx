'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useCurrency, Currency } from './CurrencyContext';

export default function Navbar() {
    const { currency, setCurrency } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className={styles.nav}>
            <div className={`container ${styles.container}`}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo}>
                        Glass Market
                    </Link>
                    <a href="https://discord.gg/Hg8qTytv5K" target="_blank" rel="noopener noreferrer" className={styles.discordBtn}>
                        <img src="/assets/icons/contact/discord.svg" alt="Discord" className={styles.discordIcon} />
                        Join
                    </a>
                </div>

                <div className={styles.currencyWrapper}>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency)}
                        className={styles.currencySelect}
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </div>

                <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                    <span className={`${styles.bar} ${isOpen ? styles.open : ''}`}></span>
                    <span className={`${styles.bar} ${isOpen ? styles.open : ''}`}></span>
                    <span className={`${styles.bar} ${isOpen ? styles.open : ''}`}></span>
                </button>

                <div className={`${styles.links} ${isOpen ? styles.open : ''}`}>
                    <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
                    <Link href="/list-account" onClick={() => setIsOpen(false)}>List Account</Link>
                    <Link href="/" onClick={() => setIsOpen(false)}>Browse</Link>
                    <Link href="/admin/login" onClick={() => setIsOpen(false)}>Admin</Link>
                </div>
            </div>
        </nav>
    );
}
