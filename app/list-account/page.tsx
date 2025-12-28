'use client';

import { useState } from 'react';
import styles from './page.module.css';
import GlassCard from '@/components/Shared/GlassCard';
import GlassButton from '@/components/Shared/GlassButton';

const ACCOUNT_TYPES = ['High Tier', 'OG', 'Semi-OG', 'Low Tier', 'Minecon', 'Stats'];
const CAPES = [
    '15th Anniversary', 'Cherry Blossom', 'Common', 'Copper', "Follower's", "Founder's",
    'Home', 'MCC 15Tth Year', 'Menace', 'Migrator', 'MineCon 2011', 'MineCon 2012',
    'MineCon 2013', 'MineCon 2015', 'MineCon 2016', 'Minecraft Experience',
    'Mojang Office', 'Pan', 'Purple Heart', 'Realms Mapmaker', 'Translator',
    'Vanilla', 'Yearn', 'Zombie Horse'
];

export default function ListAccountPage() {
    const [formData, setFormData] = useState({
        username: '',
        accountTypes: [] as string[],
        nameChanges: '',
        description: '',
        priceBin: '',
        priceCurrentOffer: '',
        capes: [] as string[],
        oguProfileUrl: '',
        contactDiscord: '',
        contactTelegram: '',
        currentOwnerName: '', // Added field
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successUsername, setSuccessUsername] = useState('');

    const toggleAccountType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            accountTypes: prev.accountTypes.includes(type)
                ? prev.accountTypes.filter(t => t !== type)
                : [...prev.accountTypes, type]
        }));
    };

    const toggleCape = (cape: string) => {
        setFormData(prev => ({
            ...prev,
            capes: prev.capes.includes(cape)
                ? prev.capes.filter(c => c !== cape)
                : [...prev.capes, cape]
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (formData.accountTypes.length === 0) {
            newErrors.accountTypes = 'Select at least one account type';
        }

        if (!formData.nameChanges) {
            newErrors.nameChanges = 'Name changes is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.priceBin) {
            newErrors.priceBin = 'BIN price is required';
        }

        if (!formData.priceCurrentOffer && formData.priceCurrentOffer !== '0') {
            newErrors.priceCurrentOffer = 'Current offer is required (put 0 if no offer)';
        }

        if (!formData.oguProfileUrl && !formData.contactDiscord && !formData.contactTelegram) {
            newErrors.contact = 'At least one contact method is required';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/listings/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessUsername(formData.username);
                setShowSuccess(true);
                // Reset form
                setFormData({
                    username: '',
                    accountTypes: [],
                    nameChanges: '',
                    description: '',
                    priceBin: '',
                    priceCurrentOffer: '',
                    capes: [],
                    oguProfileUrl: '',
                    contactDiscord: '',
                    contactTelegram: '',

                    currentOwnerName: ''
                });
                setErrors({});
            } else {
                setErrors({ submit: data.error || 'Failed to submit listing' });
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showSuccess) {
        return (
            <div className={`container ${styles.pageContainer}`}>
                <GlassCard className={styles.card}>
                    <div className={styles.successContainer}>
                        <div className={styles.successIcon}>✓</div>
                        <h1 className={styles.successTitle}>Listing Submitted!</h1>
                        <p className={styles.successMessage}>
                            Account <strong>{successUsername}</strong> has been sent for approval! We will contact you once it gets accepted.
                        </p>
                        <GlassButton onClick={() => setShowSuccess(false)}>
                            Submit Another Listing
                        </GlassButton>
                        <a href="https://discord.gg/Hg8qTytv5K" target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '1rem', width: '100%' }}>
                            <button style={{
                                background: '#5865F2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                width: '100%',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 15px rgba(88, 101, 242, 0.4)'
                            }}>
                                Join the Discord Server
                            </button>
                        </a>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className={`container ${styles.pageContainer}`}>
            <GlassCard className={styles.card}>
                <h1 className={styles.title}>List Your Account</h1>
                <p className={styles.subtitle}>Fill out the form below to submit your account for listing approval.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Username */}
                    <div className={styles.formSection}>
                        <label className={styles.label}>
                            Account Username <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Enter the account username (e.g. Reprising, R****se)"
                        />
                        {errors.username && <span className={styles.error}>{errors.username}</span>}
                    </div>

                    <div className={styles.formSection}>
                        <label className={styles.label}>
                            Current Owner (You) <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.currentOwnerName}
                            onChange={(e) => setFormData({ ...formData, currentOwnerName: e.target.value })}
                            placeholder="Enter your alias (e.g. Reprise)"
                        />
                        {/* Optional: Add error handling if validation is strictly required later */}
                    </div>

                    {/* Account Types */}
                    <div className={styles.formSection}>
                        <label className={styles.label}>
                            Account Type <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.checkboxGrid}>
                            {ACCOUNT_TYPES.map(type => (
                                <label key={type} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={formData.accountTypes.includes(type)}
                                        onChange={() => toggleAccountType(type)}
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                        {errors.accountTypes && <span className={styles.error}>{errors.accountTypes}</span>}
                    </div>

                    {/* Name Changes */}
                    <div className={styles.sliderContainer}>
                        <label className={styles.sliderLabel}>
                            Number of Name Changes: {formData.nameChanges === '' ? 'Select' :
                                parseInt(formData.nameChanges) === 0 ? 'Prename' :
                                    parseInt(formData.nameChanges) >= 15 ? '15+' : formData.nameChanges} <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="15"
                            className={styles.range}
                            value={formData.nameChanges === '' ? 0 : formData.nameChanges}
                            onChange={(e) => setFormData({ ...formData, nameChanges: e.target.value })}
                        />
                        <div className={styles.rangeLabels}>
                            <span>Prename (0)</span>
                            <span>15+</span>
                        </div>
                        {errors.nameChanges && <span className={styles.error}>{errors.nameChanges}</span>}
                    </div>

                    {/* Description */}
                    <div className={styles.formSection}>
                        <label className={styles.label}>
                            Description <span className={styles.required}>*</span>
                        </label>
                        <textarea
                            className={styles.textarea}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Include OGO, stats, bans, cosmetics, etc."
                            rows={5}
                        />
                        {errors.description && <span className={styles.error}>{errors.description}</span>}
                    </div>

                    {/* Pricing */}
                    <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label className={styles.label}>
                                BIN (Buy It Now) <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                className={styles.input}
                                value={formData.priceBin}
                                onChange={(e) => setFormData({ ...formData, priceBin: e.target.value })}
                                placeholder="$0"
                            />
                            {errors.priceBin && <span className={styles.error}>{errors.priceBin}</span>}
                        </div>

                        <div className={styles.formSection}>
                            <label className={styles.label}>
                                C/O (Current Offer) <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                className={styles.input}
                                value={formData.priceCurrentOffer}
                                onChange={(e) => setFormData({ ...formData, priceCurrentOffer: e.target.value })}
                                placeholder="Put 0 if no current offer"
                            />
                            {errors.priceCurrentOffer && <span className={styles.error}>{errors.priceCurrentOffer}</span>}
                        </div>
                    </div>

                    {/* Capes */}
                    <div className={styles.formSection}>
                        <label className={styles.label}>Capes (Optional)</label>
                        <div className={styles.checkboxGrid}>
                            {CAPES.map(cape => (
                                <label key={cape} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={formData.capes.includes(cape)}
                                        onChange={() => toggleCape(cape)}
                                    />
                                    <span>{cape}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Contact Information</h2>
                        <p className={styles.sectionSubtitle}>
                            Provide at least one contact method. Leave blank if you don't have that social.
                        </p>

                        <div className={styles.contactFields}>
                            <div className={styles.formSection}>
                                <label className={styles.label}>OGUser Profile Link</label>
                                <input
                                    type="url"
                                    className={styles.input}
                                    value={formData.oguProfileUrl}
                                    onChange={(e) => setFormData({ ...formData, oguProfileUrl: e.target.value })}
                                    placeholder="https://oguser.com/..."
                                />
                            </div>

                            <div className={styles.formSection}>
                                <label className={styles.label}>Discord Username</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={formData.contactDiscord}
                                    onChange={(e) => setFormData({ ...formData, contactDiscord: e.target.value })}
                                    placeholder="username"
                                />
                            </div>

                            <div className={styles.formSection}>
                                <label className={styles.label}>Telegram</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={formData.contactTelegram}
                                    onChange={(e) => setFormData({ ...formData, contactTelegram: e.target.value })}
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        {errors.contact && <span className={styles.error}>{errors.contact}</span>}
                    </div>

                    {/* Ticket Number Removed */}

                    {/* Submit */}
                    {errors.submit && (
                        <div className={styles.submitError}>{errors.submit}</div>
                    )}

                    <GlassButton
                        type="submit"
                        fullWidth
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Listing'}
                    </GlassButton>
                </form>
            </GlassCard>
        </div>
    );
}
