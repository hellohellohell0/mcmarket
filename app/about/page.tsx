'use client';

import styles from './page.module.css';
import GlassCard from '@/components/Shared/GlassCard';

export default function AboutPage() {
    return (
        <div className={`container ${styles.pageContainer}`}>
            <GlassCard className={styles.card}>
                <h1 className={styles.title}>About Glass Market</h1>
                <p className={styles.bodyText}>
                    MCMarket is an account marketplace made by Reprise for the purpose of browsing and finding accounts easily. It includes a simple interface and functionality, as well as a detailed filtering system to tailor results to your liking.
                </p>
                <p className={styles.bodyText}>
                    To list an account, simply create a ticket in the discord server and provide all the account details as well as your contacts (I will confirm your identity). Sellers can provide detailed descriptions, contact information and OGU links to ensure customers can reach them directly.
                </p>
            </GlassCard>
        </div>
    );
}
