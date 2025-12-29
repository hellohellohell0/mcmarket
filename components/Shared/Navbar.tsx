'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
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
                    <Link href="/about">About</Link>
                    <Link href="/list-account">List Account</Link>
                    <Link href="/">Browse</Link>
                    <Link href="/admin/login">Admin</Link>
                </div>
            </div>
        </nav>
    );
}
