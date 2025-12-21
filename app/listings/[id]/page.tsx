'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SkinViewer from '@/components/Shared/SkinViewer';
import styles from './page.module.css';

interface Cape {
    id: string;
    name: string;
}

interface Listing {
    id: string;
    username: string;
    description: string;
    priceCurrentOffer: number | null;
    priceBin: number | null;
    skinUrl: string | null;
    capes: Cape[];
    accountTypes: string; // CSV
    nameChanges: number;
    sellerName: string;
    sellerDiscordId: string;
    publicContact: string;
    status: string;
}

export default function ListingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchListing() {
            try {
                const res = await fetch(`/api/listings/${id}`);
                if (!res.ok) throw new Error('Listing not found');
                const data = await res.json();
                setListing(data.listing);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchListing();
    }, [id]);

    const handleBuyClick = () => {
        // "Make it so that when users attempt to click on it, it will redirect them to a page telling them to make a ticket in the discord server to offer or buy."
        // I'll create a simple 'ticket' page or just alert for now?
        // "redirect them to a page" -> /buy/ticket-instruction
        router.push('/buy-instructions');
    };

    if (loading) return <div className="container" style={{ padding: '2rem', color: '#fff' }}>Loading listing...</div>;
    if (error || !listing) return <div className="container" style={{ padding: '2rem', color: '#fff' }}>Error: {error || 'Not found'}</div>;

    const getCapeImage = (name: string) => `/assets/capes/${name}.png`;

    return (
        <div className={styles.container}>
            <div className={styles.topSection}>
                <div className={styles.imageColumn}>
                    <div className={styles.skinContainer}>
                        {listing.skinUrl ? (
                            <SkinViewer skinUrl={listing.skinUrl} width="100%" height={500} staticModel={false} />
                        ) : (
                            <div className={styles.placeholderSkin} />
                        )}
                    </div>
                    {listing.capes.length > 0 && (
                        <div className={styles.capesRow}>
                            {listing.capes.map(cape => (
                                <img
                                    key={cape.id}
                                    src={getCapeImage(cape.name)}
                                    alt={cape.name}
                                    className={styles.capeIcon}
                                    title={cape.name}
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/capes/placeholder.png' }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.infoColumn}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{listing.username}</h1>
                    </div>


                    <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Name Changes</span>
                            <span className={styles.metaValue}>
                                {listing.nameChanges === 0 ? 'Prename (0)' : listing.nameChanges >= 15 ? '15+' : listing.nameChanges}
                            </span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Account Type(s)</span>
                            <span className={styles.metaValue}>{listing.accountTypes}</span>
                        </div>
                    </div>

                    <p className={styles.description}>{listing.description}</p>

                    <div className={styles.priceContainer}>
                        <div className={styles.pricesGrid}>
                            <div className={styles.priceCard}>
                                <span className={styles.priceLabel}>Current Offer</span>
                                <span className={styles.priceValue}>
                                    {listing.priceCurrentOffer !== null ? `$${listing.priceCurrentOffer.toLocaleString()}` : 'N/A'}
                                </span>
                            </div>
                            <div className={styles.priceCard}>
                                <span className={styles.priceLabel}>Buy It Now</span>
                                <span className={styles.priceValue}>
                                    {listing.priceBin !== null ? `$${listing.priceBin.toLocaleString()}` : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <button onClick={handleBuyClick} className={styles.buyButton}>
                            Buy / Offer
                        </button>
                    </div>

                    <div className={styles.sellerSection}>
                        <h3>Seller Information</h3>
                        <div className={styles.contactList}>
                            <div className={styles.contactItem}>
                                <span className={styles.contactType}>Seller</span>
                                <span>{listing.sellerName}</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactType}>Contact</span>
                                <span>{listing.publicContact}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
