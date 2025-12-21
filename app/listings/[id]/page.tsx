'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Button from '@/components/Shared/Button'; // Maybe for "Buy" button or similar interaction later
import SkinViewer from '@/components/Shared/SkinViewer';
import styles from './page.module.css';

interface Cape {
    id: string;
    name: string;
}

interface User {
    username: string;
    pfpUrl: string | null;
    contactInfo: { type: string, value: string }[];
}

interface Listing {
    id: string;
    username: string;
    description: string;
    priceCurrentOffer: number | null;
    priceBin: number | null;
    skinUrl: string | null;
    capes: Cape[];
    seller: User;
}

export default function ListingPage() {
    const { id } = useParams();
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

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading listing...</div>;
    if (error || !listing) return <div className="container" style={{ padding: '2rem' }}>Error: {error || 'Not found'}</div>;

    const getCapeImage = (name: string) => {
        // Filenames must match capes. User should upload them to public/assets/capes/
        return `/assets/capes/${name}.png`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.topSection}>
                <div className={styles.imageColumn}>
                    <div className={styles.skinContainer}>
                        {listing.skinUrl ? (
                            <SkinViewer skinUrl={listing.skinUrl} width={300} height={400} />
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
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/capes/placeholder.png' }} // Fallback
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.infoColumn}>
                    <h1 className={styles.title}>{listing.username}</h1>
                    <p className={styles.description}>{listing.description}</p>

                    <div className={styles.priceBox}>
                        <div className={styles.priceRow}>
                            <span className={styles.priceLabel}>Current Offer</span>
                            <span className={styles.priceValue}>
                                {listing.priceCurrentOffer !== null ? `$${listing.priceCurrentOffer.toLocaleString()}` : 'N/A'}
                            </span>
                        </div>
                        <div className={styles.priceRow}>
                            <span className={styles.priceLabel}>BIN</span>
                            <span className={styles.priceValue}>
                                {listing.priceBin !== null ? `$${listing.priceBin.toLocaleString()}` : 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className={styles.sellerSection}>
                        <h3>Seller Information</h3>
                        <div className={styles.sellerProfile}>
                            {listing.seller.pfpUrl ? (
                                <img src={listing.seller.pfpUrl} alt={listing.seller.username} className={styles.sellerPfp} />
                            ) : (
                                <div className={styles.sellerPlaceholder} />
                            )}
                            <span className={styles.sellerName}>{listing.seller.username}</span>
                        </div>

                        <div className={styles.contactList}>
                            {listing.seller.contactInfo.map((contact, i) => (
                                <div key={i} className={styles.contactItem}>
                                    <span className={styles.contactType}>{contact.type}:</span>
                                    <span className={styles.contactValue}>{contact.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
