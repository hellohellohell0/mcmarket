'use client';

import styles from './page.module.css';
import GlassCard from '@/components/Shared/GlassCard';
import GlassButton from '@/components/Shared/GlassButton';

export default function AboutClient() {
    return (
        <div className={`container ${styles.pageContainer}`}>
            <GlassCard className={styles.card}>
                <h1 className={styles.title}>About Glass Market</h1>
                <p className={styles.bodyText}>
                    Glass Market is an account marketplace made by Reprise for the purpose of browsing, selling, and buying accounts easily. It includes a simple interface and functionality, as well as a detailed filtering system to tailor results to your liking.
                </p>
                <p className={styles.bodyText}>
                    To list an account, create a ticket in the discord server and provide all the account details as well as your OGU so I can confirm your identity (if you're a known seller). Sellers can provide detailed descriptions with OGO and stats, and contact information to ensure customers can reach them directly.
                </p>
                <div className={styles.actions}>
                    <GlassButton className="discordButton" onClick={() => window.open('https://discord.gg/Hg8qTytv5K', '_blank')}>
                        Join Discord Server
                    </GlassButton>
                </div>
            </GlassCard>
        </div>
    );
}
