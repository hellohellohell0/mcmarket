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
                                    <img src="/assets/icons/contact/ogu.png" alt="OGU" className={styles.contactIcon} />
                                </a>
                            )}
                            {listing.contactDiscord && (
                                <div className={styles.contactButton}>
                                    <img src="/assets/icons/contact/discord.png" alt="Discord" className={styles.contactIcon} />
                                    <div className={styles.discordTooltip}>{listing.contactDiscord}</div>
                                </div>
                            )}
                            {listing.contactTelegram && (
                                <a href={`https://t.me/${listing.contactTelegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.contactButton} title="Telegram">
                                    <img src="/assets/icons/contact/telegram.png" alt="Telegram" className={styles.contactIcon} />
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
