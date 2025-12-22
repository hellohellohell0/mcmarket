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
    capes: Cape[];
    accountTypes: string; // CSV
    nameChanges: number;
    sellerName: string;
    sellerDiscordId: string;
    publicContact: string;
    contactTelegram: string | null;
    contactDiscord: string | null;
    status: string;
    currentOwnerName: string;
    isVerifiedOwner: boolean;
    oguProfileUrl: string | null;
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
        router.push(`/listings/${id}/buy`);
    };

    if (loading) return <div className="container" style={{ padding: '2rem', color: '#fff' }}>Loading listing...</div>;
    if (error || !listing) return <div className="container" style={{ padding: '2rem', color: '#fff' }}>Error: {error || 'Not found'}</div>;

    const getCapeImage = (name: string) => `/assets/capes/${name}.png`;

    return (
        <div className={styles.container}>
            <div className={styles.topSection}>
                <div className={styles.imageColumn}>
                    <div className={styles.skinContainer}>
                        <SkinViewer skinUrl={`https://minotar.net/skin/${listing.username}`} width="100%" height={500} staticModel={false} />
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

                    <div className={styles.ownerSection}>
                        <div className={styles.ownerInfo}>
                            <span className={styles.metaLabel}>Current Owner:</span>
                            <span className={styles.ownerName}>{listing.currentOwnerName}</span>
                            {listing.isVerifiedOwner && (
                                <div className={styles.verifiedBadge} title="This owner has verified ownership of this account">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            )}
                        </div>
                        {listing.isVerifiedOwner && listing.oguProfileUrl && (
                            <a href={listing.oguProfileUrl} target="_blank" rel="noopener noreferrer" className={styles.oguButton}>
                                OGU Profile
                            </a>
                        )}
                    </div>

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
                                <div className={styles.contactButtons}>
                                    {listing.oguProfileUrl && (
                                        <a href={listing.oguProfileUrl} target="_blank" rel="noopener noreferrer" className={styles.contactButton} title="OGU Profile">
                                            <img src="/assets/icons/contact/ogu.png" alt="OGU" className={styles.contactIcon} />
                                        </a>
                                    )}
                                    {listing.contactDiscord && (
                                        <div className={styles.contactButton}>
                                            <img src="/assets/icons/contact/discord.svg" alt="Discord" className={styles.contactIcon} />
                                            <div className={styles.discordTooltip}>{listing.contactDiscord}</div>
                                        </div>
                                    )}
                                    {listing.contactTelegram && (
                                        <a href={`https://t.me/${listing.contactTelegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.contactButton} title="Telegram">
                                            <img src="/assets/icons/contact/telegram.svg" alt="Telegram" className={styles.contactIcon} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
