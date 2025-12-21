import Link from 'next/link';
import styles from './page.module.css';

export default function BuyInstructions() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>How to Buy</h1>
            <p className={styles.text}>
                To duplicate or purchase this account, please join our Discord server and create a ticket.
            </p>
            <p className={styles.text}>
                Our staff will assist you with the secure transaction.
            </p>
            <Link href="https://discord.gg/example" target="_blank" className={styles.discordBtn}>
                Join Discord
            </Link>
        </div>
    );
}
