'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Shared/Button';
import styles from './create.module.css';

export default function CreateListingPage() {
    const [username, setUsername] = useState('');
    const [description, setDescription] = useState('');
    const [priceCO, setPriceCO] = useState('');
    const [priceBIN, setPriceBIN] = useState('');
    const [capes, setCapes] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const availableCapes = ['Common', 'Pan', 'Purple Heart'];

    const handleCapeToggle = (cape: string) => {
        setCapes(prev =>
            prev.includes(cape) ? prev.filter(c => c !== cape) : [...prev, cape]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    description,
                    priceCurrentOffer: priceCO ? parseFloat(priceCO) : null,
                    priceBin: priceBIN ? parseFloat(priceBIN) : null,
                    capes
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create listing');
            }

            router.push('/dashboard');
        } catch (err: any) {
            // If error is about contact info, show helpful message or link
            if (err.message.includes('contact info')) {
                setError(err.message + ' Go to your dashboard to add it.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`container ${styles.container}`}>
            <div className={styles.card}>
                <h1>List Account for Sale</h1>
                <p className={styles.subtitle}>Enter account details below.</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Minecraft Username</label>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className={styles.textarea}
                            required
                            rows={4}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Current Offer ($)</label>
                            <input
                                type="number"
                                value={priceCO}
                                onChange={e => setPriceCO(e.target.value)}
                                className={styles.input}
                                placeholder="0"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>BIN ($)</label>
                            <input
                                type="number"
                                value={priceBIN}
                                onChange={e => setPriceBIN(e.target.value)}
                                className={styles.input}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Capes</label>
                        <div className={styles.capesGroup}>
                            {availableCapes.map(cape => (
                                <label key={cape} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={capes.includes(cape)}
                                        onChange={() => handleCapeToggle(cape)}
                                    />
                                    <span>{cape}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Creating Listing...' : 'List Account'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
