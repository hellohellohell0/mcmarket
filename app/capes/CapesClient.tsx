'use client';

import React from 'react';
import styles from './capes.module.css';
import GlassCard from '@/components/Shared/GlassCard';
import GlassButton from '@/components/Shared/GlassButton';
import { useCurrency } from '@/components/Shared/CurrencyContext';

interface Cape {
    id: string;
    name: string;
    image: string;
    price: number;
    outOfStock: boolean;
}

// CAPE CONFIGURATION: easily edit prices and stock availability here.
const capes: Cape[] = [
    {
        id: 'copper',
        name: 'Copper',
        image: '/assets/capes/Copper.png',
        price: 50,
        outOfStock: false,
    },
    {
        id: 'home',
        name: 'Home',
        image: '/assets/capes/Home.png',
        price: 150,
        outOfStock: false,
    },
    {
        id: 'menace',
        name: 'Menace',
        image: '/assets/capes/Menace.png',
        price: 300,
        outOfStock: false,
    },
    {
        id: 'purple_heart',
        name: 'Purple Heart',
        image: '/assets/capes/Purple Heart.png',
        price: 250,
        outOfStock: false,
    },
    {
        id: 'minecraft_experience',
        name: 'Minecraft Experience',
        image: '/assets/capes/Minecraft Experience.png',
        price: 400,
        outOfStock: false,
    }
];

export default function CapesClient() {
    const { formatPrice } = useCurrency();

    return (
        <div className={`container ${styles.pageContainer}`}>
            <h1 className={styles.pageTitle}>Capes Collection</h1>
            
            <div className={styles.gridContainer}>
                {capes.map((cape) => (
                    <GlassCard key={cape.id} className={styles.capeCard}>
                        <div className={styles.imageWrapper}>
                            <img 
                                src={cape.image} 
                                alt={cape.name} 
                                className={`${styles.capeImage} ${cape.outOfStock ? styles.outOfStockImage : ''}`}
                            />
                        </div>
                        <h2 className={styles.capeName}>{cape.name}</h2>
                        
                        {cape.outOfStock ? (
                            <div className={styles.outOfStockText}>Out of Stock</div>
                        ) : (
                            <div className={styles.priceText}>{formatPrice(cape.price, 'USD')}</div>
                        )}
                    </GlassCard>
                ))}
            </div>

            <GlassCard className={styles.purchaseSection}>
                <h3 className={styles.purchaseTitle}>To Purchase:</h3>
                <p className={styles.purchaseText}>
                    Create a ticket in the <a href="https://discord.gg/Hg8qTytv5K" target="_blank" rel="noopener noreferrer" className={styles.link}>Discord Server</a> and state your purchase or message me on <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className={styles.link}>Telegram</a>.
                </p>
                <div className={styles.purchaseActions}>
                    <GlassButton variant="discord" onClick={() => window.open('https://discord.gg/Hg8qTytv5K', '_blank')}>
                        Join Discord Server
                    </GlassButton>
                </div>
            </GlassCard>
        </div>
    );
}
