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

    return (
        <Link href={`/listings/${listing.id}`} className={styles.card}>
            <div className={styles.imageContainer}>
                <div className={styles.skinWrapper}>
                    <SkinViewer skinUrl={`https://minotar.net/skin/${listing.username}`} width="100%" height="100%" staticModel={true} />
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
                <div className={styles.header}>
                    <h3 className={styles.username}>{listing.username}</h3>
                    <div className={styles.badge}>{listing.accountTypes}</div>
                </div>

                <p className={styles.description}>{listing.description}</p>

                <div className={styles.meta}>
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
                    <div className={styles.owner}>
                        <span className={styles.ownerName}>@{listing.currentOwnerName}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
