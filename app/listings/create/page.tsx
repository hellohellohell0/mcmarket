'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function CreateListing() {
    const router = useRouter();
    const [form, setForm] = useState({
        username: '',
        description: '',
        priceCurrentOffer: '',
        priceBin: '',
        accountTypes: [] as string[],
        nameChanges: 0,
        sellerName: '',
        sellerDiscordId: '',
        publicContact: '',
    });
    const [capes, setCapes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const accountTypesOptions = ['High Tier', 'OG', 'Semi-OG', 'Low Tier', 'Stats'];

    const handleTypeChange = (type: string) => {
        setForm(prev => {
            if (prev.accountTypes.includes(type)) {
                return { ...prev, accountTypes: prev.accountTypes.filter(t => t !== type) };
            }
            return { ...prev, accountTypes: [...prev.accountTypes, type] };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, capes })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to create listing');

            // Redirect to home or success
            router.push('/');
            alert('Listing submitted for approval!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>List Account</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.section}>
                    <label>Account Username</label>
                    <input
                        type="text"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.section}>
                    <label>Description</label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Include OGO, detailed stats, etc."
                        required
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.half}>
                        <label>Current Offer ($)</label>
                        <input
                            type="number"
                            value={form.priceCurrentOffer}
                            onChange={e => setForm({ ...form, priceCurrentOffer: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.half}>
                        <label>BIN ($)</label>
                        <input
                            type="number"
                            value={form.priceBin}
                            onChange={e => setForm({ ...form, priceBin: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <label>Account Type</label>
                    <div className={styles.checkboxGroup}>
                        {accountTypesOptions.map(type => (
                            <label key={type} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={form.accountTypes.includes(type)}
                                    onChange={() => handleTypeChange(type)}
                                />
                                <span>{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <label>
                        Name Changes: {form.nameChanges === 0 ? 'Prename' : form.nameChanges >= 15 ? '15+' : form.nameChanges}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="15"
                        value={form.nameChanges}
                        onChange={e => setForm({ ...form, nameChanges: parseInt(e.target.value) })}
                        className={styles.range}
                    />
                    <div className={styles.rangeLabels}>
                        <span>0 (Prename)</span>
                        <span>15+</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Seller Information</h3>

                    <label>Your Name (Public)</label>
                    <input
                        type="text"
                        value={form.sellerName}
                        onChange={e => setForm({ ...form, sellerName: e.target.value })}
                        placeholder="e.g. Kerr"
                        required
                        className={styles.input}
                    />
                    <p className={styles.hint}>This is the name that will be shown on your listing.</p>

                    <label>Discord Tag (For Admin Notification)</label>
                    <input
                        type="text"
                        value={form.sellerDiscordId}
                        onChange={e => setForm({ ...form, sellerDiscordId: e.target.value })}
                        placeholder="e.g. username#1234"
                        required
                        className={styles.input}
                    />
                    <p className={styles.hint}>This discord account will be notified when the listing is approved.</p>

                    <label>Public Contact Info (For Buyers)</label>
                    <input
                        type="text"
                        value={form.publicContact}
                        onChange={e => setForm({ ...form, publicContact: e.target.value })}
                        placeholder="e.g. Telegram: @kerr, Discord Server: gg/..."
                        required
                        className={styles.input}
                    />
                </div>

                <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Submitting...' : 'Submit Listing'}
                </button>
            </form>
        </div>
    );
}
