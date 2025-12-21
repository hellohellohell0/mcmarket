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
        // simplified mock urls or placeholders basically
        // In real app, these would be assets or external URLs
        const map: Record<string, string> = {
            'Common': 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/91/MineCon_2011_Cape.png', // Example
            'Pan': 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/85/MineCon_2016_Cape.png',
            'Purple Heart': 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/a9/Mojang_Cape.png'
        };
        return map[name] || 'https://assets.mojang.com/skin/cape/null.png';
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
