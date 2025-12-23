'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SkinViewer from '@/components/Shared/SkinViewer';
import styles from './page.module.css';
import GlassCard from '@/components/Shared/GlassCard';
import GlassButton from '@/components/Shared/GlassButton';

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

    if (loading) return <div className="container" style={{ padding: '4rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Loading immersive experience...</div>;
    if (error || !listing) return <div className="container" style={{ padding: '4rem', color: '#ff3e9d' }}>Error: {error || 'Not found'}</div>;

    const getCapeImage = (name: string) => `/assets/capes/${name}.png`;

    return (
        <div className={`container ${styles.pageContainer}`}>
            <div className={styles.layout}>
                <div className={styles.imageColumn}>
                    <div className={styles.skinCard}>
                        <div className={styles.skinWrapper}>
                            <SkinViewer skinUrl={`https://minotar.net/skin/${listing.username}`} width="100%" height={600} staticModel={false} />
                        </div>
                        {listing.capes.length > 0 && (
                            <div className={styles.capesOverlay}>
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
                </div>

                <div className={styles.infoColumn}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{listing.username}</h1>
                        <div className={styles.typeBadges}>
                            {listing.accountTypes.split(',').map(t => (
                                <span key={t} className={styles.badge}>#{t.trim()}</span>
                            ))}
                        </div>
                    </div>

                    <GlassCard className={styles.descriptionCard}>
                        <h3 className={styles.sectionTitle}>Overview</h3>
                        <p className={styles.description}>{listing.description}</p>

                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Name Changes</span>
                                <span className={styles.statValue}>
                                    {listing.nameChanges === 0 ? '0 (Prename)' : listing.nameChanges >= 15 ? '15+' : listing.nameChanges}
                                </span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Owner Status</span>
                                <span className={`${styles.statValue} ${listing.isVerifiedOwner ? styles.verified : ''}`}>
                                    {listing.isVerifiedOwner ? 'Verified' : 'Unverified'}
                                </span>
                            </div>
                        </div>
                    </GlassCard>

                    <div className={styles.actionSection}>
                        <div className={styles.pricingRow}>
                            <GlassCard className={styles.priceCard}>
                                <span className={styles.priceLabel}>Current Offer</span>
                                <span className={styles.priceValue}>
                                    {listing.priceCurrentOffer !== null ? `$${listing.priceCurrentOffer.toLocaleString()}` : '—'}
                                </span>
                            </GlassCard>
                            <GlassCard className={styles.priceCard}>
                                <span className={styles.priceLabel}>Buy It Now</span>
                                <span className={styles.priceValue}>
                                    {listing.priceBin !== null ? `$${listing.priceBin.toLocaleString()}` : '—'}
                                </span>
                            </GlassCard>
                        </div>
                        <GlassButton fullWidth onClick={handleBuyClick}>
                            Purchase or Make Offer
                        </GlassButton>
                    </div>

                    <GlassCard className={styles.sellerCard}>
                        <h3 className={styles.sectionTitle}>Seller Inquiry</h3>
                        <div className={styles.sellerRow}>
                            <div className={styles.sellerInfo}>
                                <span className={styles.sellerName}>{listing.sellerName}</span>
                                <span className={styles.sellerRole}>Authorized Seller</span>
                            </div>
                            <div className={styles.contactIcons}>
                                {listing.oguProfileUrl && (
                                    <a href={listing.oguProfileUrl} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                                        <img src="/assets/icons/contact/ogu.png" alt="OGU" />
                                    </a>
                                )}
                                {listing.contactDiscord && (
                                    <div className={styles.contactLink} onClick={() => navigator.clipboard.writeText(listing.contactDiscord!)}>
                                        <img src="/assets/icons/contact/discord.svg" alt="Discord" />
                                        <span className={styles.tooltip}>{listing.contactDiscord}</span>
                                    </div>
                                )}
                                {listing.contactTelegram && (
                                    <a href={`https://t.me/${listing.contactTelegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                                        <img src="/assets/icons/contact/telegram.svg" alt="Telegram" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
