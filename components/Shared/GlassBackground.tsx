'use client';

import styles from './GlassBackground.module.css';

export default function GlassBackground() {
    return (
        <div className={styles.container}>
            <div className={`${styles.blob} ${styles.blob1}`} />
            <div className={`${styles.blob} ${styles.blob2}`} />
            <div className={`${styles.blob} ${styles.blob3}`} />
            <div className={styles.overlay} />
        </div>
    );
}
