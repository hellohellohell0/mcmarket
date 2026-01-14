'use client';

import { useRouter } from 'next/navigation';
import SkinViewer from '@/components/Shared/SkinViewer';
import { useCurrency } from '@/components/Shared/CurrencyContext';
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
    identityVerified: boolean;
    oguProfileUrl: string | null;
    currency?: string;
}

interface ListingClientProps {
    listing: Listing;
}

export default function ListingClient({ listing: l }: ListingClientProps) {
    const router = useRouter();
    const { formatPrice } = useCurrency();

    const handleBuyClick = () => {
        router.push(`/listings/${l.id}/buy`);
    };

    const getCapeImage = (name: string) => `/assets/capes/${name}.png`;

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.topSection}>
                <div className={styles.imageColumn}>
                    <div className={styles.skinContainer}>
                        <SkinViewer
                            skinUrl={l.username.includes('*') ? 'https://minotar.net/skin/MHF_Steve' : `https://minotar.net/skin/${l.username}`}
                            width="100%"
                            height={500}
                            staticModel={false}
                            model={l.username.includes('*') ? 'default' : 'auto-detect'}
                        />
                    </div>
                    {l.capes.length > 0 && (
                        <div className={styles.capesRow}>
                            {l.capes.map(cape => (
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
                        <h1 className={styles.title}>{l.username}</h1>
                    </div>

                    <div className={styles.description}>
                        {l.description}
                    </div>

                    <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Name Changes</span>
                            <span className={styles.metaValue}>
                                {l.nameChanges === 0 ? '0 (Prename)' : l.nameChanges >= 15 ? '15+' : l.nameChanges}
                            </span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Type</span>
                            <span className={styles.metaValue}>{l.accountTypes}</span>
                        </div>
                    </div>

                    <div className={styles.priceContainer}>
                        <div className={styles.pricesGrid}>
                            <div className={styles.priceCard}>
                                <span className={styles.priceLabel}>Current Offer</span>
                                <span className={styles.priceValue}>
                                    {l.priceCurrentOffer !== null ? formatPrice(l.priceCurrentOffer, l.currency || 'USD') : '—'}
                                </span>
                            </div>
                            <div className={styles.priceCard}>
                                <span className={styles.priceLabel}>Buy It Now</span>
                                <span className={styles.priceValue}>
                                    {l.priceBin === 0 ? 'Not Set' : (l.priceBin !== null ? formatPrice(l.priceBin, l.currency || 'USD') : '—')}
                                </span>
                            </div>
                        </div>
                        <button className={styles.buyButton} onClick={handleBuyClick}>
                            PURCHASE/BID
                        </button>
                    </div>

                    <div className={styles.ownerSection}>
                        <div className={styles.ownerInfo}>
                            <span className={styles.label}>Owned by:</span>
                            <span className={styles.ownerName}>{l.currentOwnerName}</span>
                            {l.isVerifiedOwner && (
                                <div className={styles.verifiedBadge}>
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                    <div className={styles.verifiedTooltip}>This user has verified ownership of this account</div>
                                </div>
                            )}
                            {l.identityVerified && (
                                <div className={`${styles.verifiedBadge} ${styles.identityBadge}`} style={{ color: '#ec4899', marginLeft: '0.25rem' }}>
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                    </svg>
                                    <div className={styles.verifiedTooltip}>This user's identity has been verified onsite</div>
                                </div>
                            )}
                        </div>
                        <div className={styles.contactButtons}>
                            {l.oguProfileUrl && (
                                <a href={l.oguProfileUrl} target="_blank" rel="noopener noreferrer" className={styles.contactButton}>
                                    <img src="/assets/icons/contact/ogu.png" alt="OGU" className={styles.contactIcon} />
                                </a>
                            )}
                            {l.contactDiscord && (
                                <div className={styles.contactButton} onClick={() => navigator.clipboard.writeText(l.contactDiscord!)}>
                                    <img src="/assets/icons/contact/discord.svg" alt="Discord" className={styles.contactIcon} />
                                    <div className={styles.discordTooltip}>{l.contactDiscord}</div>
                                </div>
                            )}
                            {l.contactTelegram && (
                                <a href={`https://t.me/${l.contactTelegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.contactButton}>
                                    <img src="/assets/icons/contact/telegram.svg" alt="Telegram" className={styles.contactIcon} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
