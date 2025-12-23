'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    Glass Market
                </Link>
                <div className={styles.links}>
                    <Link href="/about">About</Link>
                    <Link href="/">Browse</Link>
                    <Link href="/admin/login">Admin</Link>
                </div>
            </div>
        </nav>
    );
}
