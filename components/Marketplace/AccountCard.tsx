'use client';

import Link from 'next/link';
import { Listing, Cape } from '@prisma/client';
import styles from './AccountCard.module.css';
import SkinViewer from '@/components/Shared/SkinViewer';
import { useCurrency } from '@/components/Shared/CurrencyContext';

interface ListingWithRelations extends Listing {
    capes: Cape[];
}

export default function AccountCard({ listing }: { listing: ListingWithRelations }) {
    const { formatPrice } = useCurrency();

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
                    <SkinViewer
                        skinUrl={skinUrl}
                        width="100%"
                        height="100%"
                        staticModel={true}
                        model={hasAsterisk ? 'default' : 'auto-detect'}
                    />
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
                                    ? formatPrice(listing.priceCurrentOffer, 'USD')
                                    : '-'}
                            </span>
                        </div>
                        {listing.priceBin !== null && (
                            <div className={styles.priceItem}>
                                <span className={styles.label}>BIN</span>
                                <span className={styles.value}>{listing.priceBin === 0 ? 'Not Set' : formatPrice(listing.priceBin, 'USD')}</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Link>
    );
}
