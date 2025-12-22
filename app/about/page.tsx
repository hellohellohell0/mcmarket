'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <p className={styles.bodyText}>
                    MCMarket is an account marketplace made by Reprise for the purpose of browsing and finding accounts easily. It includes a simple interface and functionality, as well as a detailed filtering system to tailor results to your liking. MCMarket also lets sellers easily list accounts onto the website to find their customer. Sellers will add contact information (Discord, Telegram, OGU), descriptions and OGO when listing an account so the customer knows where to find them. To list an account, simply create a ticket in the discord server and provide all the account details as well as your contacts (I will confirm your identity).
                </p>
            </div>
        </div>
    );
}
