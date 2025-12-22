'use client';

import { useState } from 'react';
import { Listing, Cape } from '@prisma/client';
import { createListing, updateListing, deleteListing, adminLogout } from '../actions';
import styles from './DashboardContent.module.css';

interface ListingWithCapes extends Listing {
    capes: Cape[];
}

interface DashboardContentProps {
    initialListings: ListingWithCapes[];
}

const ACCOUNT_TYPES_OPTIONS = ['High Tier', 'OG', 'Semi-OG', 'Low Tier', 'Stats'];
const CAPES_OPTIONS = ['minecon2011', 'minecon2012', 'minecon2013', 'minecon2015', 'minecon2016', 'cobalt', 'scrolls', 'translator'];

export default function DashboardContent({ initialListings }: DashboardContentProps) {
    const [listings, setListings] = useState<ListingWithCapes[]>(initialListings);
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState<any>({
        username: '',
        description: '',
        priceCurrentOffer: '',
        priceBin: '',
        accountTypes: [] as string[],
        nameChanges: 0,
        sellerName: 'Kerr',
        sellerDiscordId: 'N/A',
        publicContact: 'Discord: @kerr',
        listingPresence: 'Owned by me',
        currentOwnerName: 'Verified Owner',
        isVerifiedOwner: false,
        oguProfileUrl: '',
        skinUrl: '',
        capes: [] as string[]
    });

    const filteredListings = listings.filter(l =>
        l.username.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setForm({
            username: '',
            description: '',
            priceCurrentOffer: '',
            priceBin: '',
            accountTypes: [],
            nameChanges: 0,
            sellerName: 'Kerr',
            sellerDiscordId: 'N/A',
            publicContact: 'Discord: @kerr',
            listingPresence: 'Owned by me',
            currentOwnerName: 'Verified Owner',
            isVerifiedOwner: false,
            oguProfileUrl: '',
            skinUrl: '',
            capes: []
        });
    };

    const handleCreate = async () => {
        const data = {
            ...form,
            priceCurrentOffer: form.priceCurrentOffer === '' ? null : Number(form.priceCurrentOffer),
            priceBin: form.priceBin === '' ? null : Number(form.priceBin),
            accountTypes: form.accountTypes.join(', ')
        };
        const newListing = await createListing(data);
        setListings([newListing as any, ...listings]);
        setIsCreating(false);
        resetForm();
    };

    const handleUpdate = async (id: string) => {
        const data = {
            ...form,
            priceCurrentOffer: form.priceCurrentOffer === '' ? null : Number(form.priceCurrentOffer),
            priceBin: form.priceBin === '' ? null : Number(form.priceBin),
            accountTypes: form.accountTypes.join(', ')
        };
        await updateListing(id, data);
        setListings(prev => prev.map(l => l.id === id ? { ...l, ...data, capes: form.capes.map((c: string) => ({ name: c })) } : l));
        setEditingId(null);
        resetForm();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        await deleteListing(id);
        setListings(prev => prev.filter(l => l.id !== id));
    };

    const startEdit = (listing: ListingWithCapes) => {
        setForm({
            ...listing,
            priceCurrentOffer: listing.priceCurrentOffer ?? '',
            priceBin: listing.priceBin ?? '',
            accountTypes: listing.accountTypes.split(', ').filter(Boolean),
            capes: listing.capes.map(c => c.name)
        });
        setEditingId(listing.id);
        setIsCreating(false);
    };

    const toggleType = (type: string) => {
        setForm((prev: any) => ({
            ...prev,
            accountTypes: prev.accountTypes.includes(type)
                ? prev.accountTypes.filter((t: string) => t !== type)
                : [...prev.accountTypes, type]
        }));
    };

    const toggleCape = (cape: string) => {
        setForm((prev: any) => ({
            ...prev,
            capes: prev.capes.includes(cape)
                ? prev.capes.filter((c: string) => c !== cape)
                : [...prev.capes, cape]
        }));
    };

    const FormFields = () => (
        <div className={styles.createForm}>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>Username</label>
                    <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                    <label>Presence (e.g. Owned by me)</label>
                    <input value={form.listingPresence} onChange={e => setForm({ ...form, listingPresence: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                    <label>Current Owner</label>
                    <input value={form.currentOwnerName} onChange={e => setForm({ ...form, currentOwnerName: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                    <label>OGU Link</label>
                    <input value={form.oguProfileUrl || ''} onChange={e => setForm({ ...form, oguProfileUrl: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                    <label>Verified Owner?</label>
                    <select value={form.isVerifiedOwner ? 'yes' : 'no'} onChange={e => setForm({ ...form, isVerifiedOwner: e.target.value === 'yes' })}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>C/O</label>
                    <input type="number" value={form.priceCurrentOffer} onChange={e => setForm({ ...form, priceCurrentOffer: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                    <label>BIN</label>
                    <input type="number" value={form.priceBin} onChange={e => setForm({ ...form, priceBin: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                    <label>Name Changes</label>
                    <input type="number" value={form.nameChanges} onChange={e => setForm({ ...form, nameChanges: Number(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                    <label>Skin URL (Optional)</label>
                    <input value={form.skinUrl || ''} onChange={e => setForm({ ...form, skinUrl: e.target.value })} placeholder="e.g. textures.minecraft.net/..." />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className={styles.formGroup}>
                <label>Account Types</label>
                <div className={styles.checkboxGroup}>
                    {ACCOUNT_TYPES_OPTIONS.map(t => (
                        <label key={t} className={styles.checkboxLabel}>
                            <input type="checkbox" checked={form.accountTypes.includes(t)} onChange={() => toggleType(t)} />
                            {t}
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label>Capes</label>
                <div className={styles.checkboxGroup}>
                    {CAPES_OPTIONS.map(c => (
                        <label key={c} className={styles.checkboxLabel}>
                            <input type="checkbox" checked={form.capes.includes(c)} onChange={() => toggleCape(c)} />
                            {c}
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.formActions}>
                <button className={styles.submitBtn} onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}>
                    {editingId ? 'Save Changes' : 'Create Listing'}
                </button>
                <button className={styles.cancelBtn} onClick={() => { setIsCreating(false); setEditingId(null); resetForm(); }}>Cancel</button>
            </div>
        </div>
    );

    return (
        <div>
            <div className={styles.controls}>
                <div className={styles.createSection}>
                    {!isCreating && !editingId && (
                        <button className={styles.addBtn} onClick={() => setIsCreating(true)}>+ Create New Listing</button>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Search listings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.search}
                />

                <button onClick={() => adminLogout()} className={styles.logoutBtn}>Logout</button>
            </div>

            {(isCreating || editingId) && <FormFields />}

            <div className={styles.grid}>
                {filteredListings.map(listing => (
                    <div key={listing.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>{listing.username}</h3>
                            <span className={styles.statusBadge}>{listing.listingPresence}</span>
                        </div>

                        <div className={styles.details}>
                            <p><strong>Owner:</strong> {listing.currentOwnerName} {listing.isVerifiedOwner ? '(Verified)' : ''}</p>
                            <p><strong>C/O:</strong> ${listing.priceCurrentOffer?.toLocaleString() || 'N/A'} | <strong>BIN:</strong> ${listing.priceBin?.toLocaleString() || 'N/A'}</p>
                            <p><strong>Type:</strong> {listing.accountTypes}</p>
                            <p className={styles.desc}>{listing.description}</p>
                        </div>

                        <div className={styles.actions}>
                            <button onClick={() => startEdit(listing)} className={styles.editBtn}>Edit</button>
                            <button onClick={() => handleDelete(listing.id)} className={styles.deleteBtn}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
