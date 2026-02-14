'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/components/Shared/CurrencyContext';
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

export default function BuyClient({ id }: { id: string }) {
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const { formatPrice } = useCurrency();

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
                            {listing.priceCurrentOffer !== null ? formatPrice(listing.priceCurrentOffer, 'USD') : 'N/A'}
                        </span>
                    </div>
                    <div className={styles.priceItem}>
                        <span className={styles.priceLabel}>Buy It Now</span>
                        <span className={styles.priceValue}>
                            {listing.priceBin !== null ? formatPrice(listing.priceBin, 'USD') : 'N/A'}
                        </span>
                    </div>
                </div>

                <p className={styles.subTitle}>
                    You have two options in order to place a bid or purchase the account.
                </p>

                <div className={styles.optionsList}>
                    <div className={styles.optionItem}>
                        <div className={styles.optionText}>
                            <h3>Option 1: DISCORD</h3>
                            <div className={styles.splitOptionContainer}>
                                <div className={styles.optionCell}>
                                    <p>Create a ticket in the <a href="https://discord.gg/Hg8qTytv5K" target="_blank" rel="noopener noreferrer" className={styles.link}>discord server</a> and state your offer.</p>
                                </div>
                                <div className={styles.orSeparator}>OR</div>
                                <div className={styles.optionCell}>
                                    <p>Message me on discord with your offer</p>
                                    <div className={styles.contactHandle}>@reprisingogu</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.optionItem}>
                        <div className={styles.optionText}>
                            <h3>Option 2: TELEGRAM</h3>
                            <div className={styles.optionCell} style={{ marginTop: '1rem' }}>
                                <p>Message me on telegram with your offer</p>
                                <a href="https://t.me/reprisingogu" target="_blank" rel="noopener noreferrer" className={styles.contactHandle} style={{ textDecoration: 'none', display: 'block' }}>
                                    @reprisingogu
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
