import Link from 'next/link';
import { useMemo } from 'react';
import styles from './AccountCard.module.css';

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
}

export default function AccountCard({ listing }: { listing: Listing }) {
    // Mock capes images mapping based on name
    const getCapeImage = (name: string) => {
        return `/assets/capes/${name}.png`;
    };

    return (
        <Link href={`/listings/${listing.id}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {listing.skinUrl ? (
                    <img src={listing.skinUrl} alt={listing.username} className={styles.skin} />
                ) : (
                    <div className={styles.placeholderSkin} />
                )}

                {listing.capes.length > 0 && (
                    <div className={styles.capesOverlay}>
                        {listing.capes.map(cape => (
                            <img key={cape.id} src={getCapeImage(cape.name)} alt={cape.name} className={styles.capeIcon} title={cape.name} />
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.username}>{listing.username}</h3>
                <p className={styles.description}>{listing.description}</p>

                <div className={styles.prices}>
                    {listing.priceCurrentOffer !== null && (
                        <div className={styles.priceItem}>
                            <span className={styles.label}>C/O</span>
                            <span className={styles.value}>${listing.priceCurrentOffer.toLocaleString()}</span>
                        </div>
                    )}
                    {listing.priceBin !== null && (
                        <div className={styles.priceItem}>
                            <span className={styles.label}>BIN</span>
                            <span className={styles.value}>${listing.priceBin.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
