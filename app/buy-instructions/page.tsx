import styles from './page.module.css';
import GlassCard from '@/components/Shared/GlassCard';
import GlassButton from '@/components/Shared/GlassButton';

export default function BuyInstructions() {
    return (
        <div className={`container ${styles.pageContainer}`}>
            <GlassCard className={styles.card}>
                <h1 className={styles.title}>Purchase Inquiries</h1>
                <p className={styles.text}>
                    To purchase this account or make an official offer, please proceed to our secure Discord portal.
                </p>
                <div className={styles.infoBox}>
                    <p className={styles.smallText}>
                        Our verified transaction middleman will facilitate the trade to ensure maximum safety for both parties.
                    </p>
                </div>
                <div className={styles.actions}>
                    <GlassButton fullWidth onClick={() => window.open('https://discord.gg/example', '_blank')}>
                        Open Support Ticket
                    </GlassButton>
                </div>
            </GlassCard>
        </div>
    );
}
