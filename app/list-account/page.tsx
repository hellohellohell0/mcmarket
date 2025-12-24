'use client';

import styles from './page.module.css';
import GlassCard from '@/components/Shared/GlassCard';
import GlassButton from '@/components/Shared/GlassButton';

export default function ListAccountPage() {
    return (
        <div className={`container ${styles.pageContainer}`}>
            <GlassCard className={styles.card}>
                <h1 className={styles.title}>List Your Account</h1>
                <p className={styles.bodyText}>
                    To list your account on Glass Market, please follow these steps:
                </p>

                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <div className={styles.stepContent}>
                            <h2 className={styles.stepTitle}>Join the Discord Server</h2>
                            <p className={styles.stepText}>
                                Click the button below to join our Discord community.
                            </p>
                        </div>
                    </div>

                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <div className={styles.stepContent}>
                            <h2 className={styles.stepTitle}>Create a Ticket</h2>
                            <p className={styles.stepText}>
                                Once you've joined, create a support ticket to list your account.
                            </p>
                        </div>
                    </div>

                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <div className={styles.stepContent}>
                            <h2 className={styles.stepTitle}>Include the Following Information</h2>
                            <div className={styles.infoBox}>
                                <ul className={styles.infoList}>
                                    <li><strong>Contact (OGU, Discord, Telegram)</strong> - this is what users will be given when they want to purchase your account. I will also be confirming your identity if you are a high-reputable seller.</li>
                                    <li><strong>Username of the account</strong></li>
                                    <li><strong>Type of account (High Tier, OG, Semi-OG, Low Tier, Stats)</strong></li>
                                    <li><strong>Number of name changes</strong></li>
                                    <li><strong>Current BIN and CO</strong></li>
                                    <li><strong>Account's capes</strong></li>
                                    <li><strong>Description of the account (OGO, stats, bans, cosmetics)</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <GlassButton fullWidth onClick={() => window.open('https://discord.gg/P2WbBEDEFy', '_blank')}>
                        Join Discord Server
                    </GlassButton>
                </div>
            </GlassCard>
        </div>
    );
}
