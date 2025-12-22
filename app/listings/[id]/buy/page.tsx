'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

interface Listing {
    id: string;
    username: string;
    priceCurrentOffer: number | null;
    priceBin: number | null;
    oguProfileUrl: string | null;
    contactTelegram: string | null;
    contactDiscord: string | null;
}

export default function BuyPage() {
    const { id } = useParams();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchListing() {
            try {
                const res = await fetch(`/api/listings/${id}`);
                if (!res.ok) throw new Error('Listing not found');
                const data = await res.json();
                setListing(data.listing);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchListing();
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '4rem', color: '#fff' }}>Loading instructions...</div>;
    if (!listing) return <div className="container" style={{ padding: '4rem', color: '#fff' }}>Listing not found.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.backLink}>
                <Link href={`/listings/${id}`}>← Back to {listing.username}</Link>
            </div>

            <div className={styles.content}>
                <h1 className={styles.title}>Purchase Instructions</h1>

                <div className={styles.priceSummary}>
                    <div className={styles.priceItem}>
                        <span className={styles.priceLabel}>Current Offer</span>
                        <span className={styles.priceValue}>
                            {listing.priceCurrentOffer !== null ? `$${listing.priceCurrentOffer.toLocaleString()}` : 'N/A'}
                        </span>
                    </div>
                    <div className={styles.priceItem}>
                        <span className={styles.priceLabel}>Buy It Now</span>
                        <span className={styles.priceValue}>
                            {listing.priceBin !== null ? `$${listing.priceBin.toLocaleString()}` : 'N/A'}
                        </span>
                    </div>
                </div>

                <p className={styles.subTitle}>
                    You have two options in order to place a bid or purchase the account.
                </p>

                <div className={styles.optionsList}>
                    <div className={styles.optionItem}>
                        <div className={styles.optionText}>
                            <h3>Option 1</h3>
                            <p>Contact the seller directly</p>
                            <div className={styles.middlemanWarning}>Make sure to use a middleman</div>
                        </div>
                        <div className={styles.contactButtons}>
                            {listing.oguProfileUrl && (
                                <a href={listing.oguProfileUrl} target="_blank" rel="noopener noreferrer" className={styles.contactButton} title="OGU Profile">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                                    </svg>
                                </a>
                            )}
                            {listing.contactDiscord && (
                                <div className={styles.contactButton}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.196.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419s2.175 1.086 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419s2.175 1.086 2.157 2.419c0 1.334-.956 2.419-2.157 2.419z" />
                                    </svg>
                                    <div className={styles.discordTooltip}>{listing.contactDiscord}</div>
                                </div>
                            )}
                            {listing.contactTelegram && (
                                <a href={`https://t.me/${listing.contactTelegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.contactButton} title="Telegram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11.944 0C5.346 0 0 5.346 0 11.944c0 6.598 5.346 11.944 11.944 11.944c6.598 0 11.944-5.346 11.944-11.944C23.888 5.346 18.542 0 11.944 0zm5.83 8.3c-.15.635-.353 1.943-.538 3.193l-.842 5.35c-.1.432-.38.545-.71.365c-.538-.303-2.078-1.36-2.613-1.722a46.6 46.6 0 0 1-1.118-.788a10.02 10.02 0 0 0-.547-.432l-1.054.912c-.225.188-.413.344-.75.344c-.337 0-.281-.132-.206-.413c.094-.375.768-2.587 1.144-3.83c.018-.057.034-.114.053-.169c-.046-.018-.088-.041-.128-.066c-.6-.319-3.076-1.631-3.375-1.78a.475.475 0 0 1-.28-.432c0-.281.243-.375.543-.468c.3-.094 5.942-2.306 6.315-2.4c.375-.094.675.056.843.282c.168.225.225.543.15.862z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className={styles.optionItem}>
                        <div className={styles.optionText}>
                            <h3>Option 2</h3>
                            <p>Make a ticket in the discord server and we will connect you to the seller.</p>
                        </div>
                        <a href="https://discord.gg/P2WbBEDEFy" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.discordButton}`}>
                            Join Discord
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
