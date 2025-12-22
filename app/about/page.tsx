'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>What is MCMarket?</h1>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>For Buyers:</h2>
                    <p className={styles.bodyText}>
                        MCMarket is a marketplace for minecraft accounts that was created by Reprise for the purpose of finding and purchasing accounts effortlessly. Its marketplace-like interface along with its specific filters allow users to easily find the accounts they need and when they need it.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>For Sellers:</h2>
                    <p className={styles.bodyText}>
                        MCMarket lets you easily list accounts onto the website so that your ideal customer can find it. You can add your own contact information, links and descriptions of all of your listings. To list an account, simply create a ticket in the discord server and provide all the account details you have.
                    </p>
                </section>

                <div className={styles.cta}>
                    <a href="https://discord.gg/P2WbBEDEFy" target="_blank" rel="noopener noreferrer" className={styles.discordButton}>
                        Join Discord Server
                    </a>
                </div>
            </div>
        </div>
    );
}
