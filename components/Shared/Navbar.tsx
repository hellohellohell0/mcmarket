import Link from 'next/link';
import styles from './Navbar.module.css';
import { useCurrency, Currency } from './CurrencyContext';

export default function Navbar() {
    const { currency, setCurrency } = useCurrency();

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
                <div className={styles.links}>
                    <div className={styles.currencyWrapper} style={{ marginRight: '1rem' }}>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as Currency)}
                            className={styles.currencySelect}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                outline: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="CAD">CAD ($)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                    <Link href="/about">About</Link>
                    <Link href="/list-account">List Account</Link>
                    <Link href="/">Browse</Link>
                    <Link href="/admin/login">Admin</Link>
                </div>
            </div>
        </nav>
    );
}
