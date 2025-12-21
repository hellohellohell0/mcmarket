'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className={styles.nav}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    Marketplace
                </Link>
                <div className={styles.links}>
                    <Link href="/">Browse</Link>
                    {user ? (
                        <>
                            <Link href="/dashboard/create">Sell Account</Link>
                            <Link href="/dashboard">Profile</Link>
                            {/* Temporary Logout button logic - ideally call API */}
                            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">Login</Link>
                            <Link href="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
