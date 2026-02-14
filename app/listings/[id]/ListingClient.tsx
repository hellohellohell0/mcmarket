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

    oguProfileUrl: string | null;
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
                                    {l.priceCurrentOffer !== null ? formatPrice(l.priceCurrentOffer, 'USD') : '—'}
                                </span>
                            </div>
                            <div className={styles.priceCard}>
                                <span className={styles.priceLabel}>Buy It Now</span>
                                <span className={styles.priceValue}>
                                    {l.priceBin === 0 ? 'Not Set' : (l.priceBin !== null ? formatPrice(l.priceBin, 'USD') : '—')}
                                </span>
                            </div>
                        </div>
                        <button className={styles.buyButton} onClick={handleBuyClick}>
                            PURCHASE/BID
                        </button>
                    </div>


                </div>
            </div>
        </div >
    );
}
