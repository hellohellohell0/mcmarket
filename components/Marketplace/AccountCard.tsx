import Link from 'next/link';
import { Listing, Cape } from '@prisma/client';
import styles from './AccountCard.module.css';
import SkinViewer from '@/components/Shared/SkinViewer';

interface ListingWithRelations extends Listing {
    capes: Cape[];
}

export default function AccountCard({ listing }: { listing: ListingWithRelations }) {
    const getCapeImage = (name: string) => {
        return `/assets/capes/${name}.png`;
    };

    const hasAsterisk = listing.username.includes('*');
    const skinUrl = hasAsterisk
        ? 'https://minotar.net/skin/MHF_Steve'
        : `https://minotar.net/skin/${listing.username}`;

    return (
        <Link href={`/listings/${listing.id}`} className={styles.card}>
            <div className={styles.imageContainer}>
                <div style={{ pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', overflow: 'hidden' }}>
                    <SkinViewer skinUrl={skinUrl} width="100%" height="100%" staticModel={true} />
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

            <div className={styles.content}>
                <div className={styles.titleRow}>
                    <h3 className={styles.username}>{listing.username}</h3>
                    <span className={styles.nameChangesSubtle}>
                        {listing.nameChanges === 0 ? 'Prename' : `${listing.nameChanges >= 15 ? '15+' : listing.nameChanges} name changes`}
                    </span>
                </div>
                <p className={styles.description}>{listing.description}</p>

                <div className={styles.meta}>
                    <div className={styles.prices}>
                        <div className={styles.priceItem}>
                            <span className={styles.label}>C/O</span>
                            <span className={styles.value}>
                                {listing.priceCurrentOffer && listing.priceCurrentOffer > 0
                                    ? `$${listing.priceCurrentOffer.toLocaleString()}`
                                    : '-'}
                            </span>
                        </div>
                        {listing.priceBin !== null && (
                            <div className={styles.priceItem}>
                                <span className={styles.label}>BIN</span>
                                <span className={styles.value}>${listing.priceBin.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.owner}>
                        <span className={styles.label}>Owned by:</span>
                        <div className={styles.ownerInfo}>
                            <span className={styles.ownerName}>{listing.currentOwnerName}</span>
                            {listing.isVerifiedOwner && (
                                <div className={styles.verifiedBadge}>
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                    <div className={styles.verifiedTooltip}>Owner Verified</div>
                                </div>
                            )}
                            {listing.identityVerified && (
                                <div className={`${styles.verifiedBadge} ${styles.identityBadge}`}>
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                    </svg>
                                    <div className={styles.verifiedTooltip}>Identity Verified</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
