'use client';

import { useState } from 'react';
import { Listing, Cape, ListingStatus } from '@prisma/client';
import { updateListingStatus, updateListingPrice, adminLogout } from '../actions';
import styles from './DashboardContent.module.css';

interface ListingWithCapes extends Listing {
    capes: Cape[];
}

interface DashboardContentProps {
    initialListings: ListingWithCapes[];
}

export default function DashboardContent({ initialListings }: DashboardContentProps) {
    const [listings, setListings] = useState<ListingWithCapes[]>(initialListings);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING'); // Default to Pending as requested ("filter through pending...")
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ co: number | '', bin: number | '' }>({ co: '', bin: '' });

    const filteredListings = listings.filter(l => {
        const matchesFilter = filter === 'ALL' || l.status === filter;
        const matchesSearch = l.username.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleStatusUpdate = async (id: string, status: ListingStatus) => {
        await updateListingStatus(id, status);
        setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    };

    const startEdit = (listing: ListingWithCapes) => {
        setEditingId(listing.id);
        setEditForm({
            co: listing.priceCurrentOffer ?? '',
            bin: listing.priceBin ?? ''
        });
    };

    const saveEdit = async (id: string) => {
        const coVal = editForm.co === '' ? null : Number(editForm.co);
        const binVal = editForm.bin === '' ? null : Number(editForm.bin);
        await updateListingPrice(id, coVal, binVal);
        setListings(prev => prev.map(l => l.id === id ? { ...l, priceCurrentOffer: coVal, priceBin: binVal } : l));
        setEditingId(null);
    };

    return (
        <div>
            <div className={styles.controls}>
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'PENDING' ? styles.active : ''}`}
                        onClick={() => setFilter('PENDING')}
                    >
                        Pending
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'APPROVED' ? styles.active : ''}`}
                        onClick={() => setFilter('APPROVED')}
                    >
                        Approved
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'ALL' ? styles.active : ''}`}
                        onClick={() => setFilter('ALL')}
                    >
                        All Listings
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search username..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.search}
                />

                <button onClick={() => adminLogout()} className={styles.logoutBtn}>Logout</button>
            </div>

            <div className={styles.grid}>
                {filteredListings.map(listing => (
                    <div key={listing.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>{listing.username}</h3>
                            <span className={`${styles.statusBadge} ${styles[listing.status.toLowerCase()]}`}>
                                {listing.status}
                            </span>
                        </div>

                        <div className={styles.details}>
                            <p><strong>Seller:</strong> {listing.sellerName} ({listing.sellerDiscordId})</p>
                            <p><strong>Contact:</strong> {listing.publicContact}</p>
                            <p><strong>Type:</strong> {listing.accountTypes}</p>
                            <p><strong>Changes:</strong> {listing.nameChanges}</p>
                            <p className={styles.desc}>{listing.description}</p>
                        </div>

                        {editingId === listing.id ? (
                            <div className={styles.editPrice}>
                                <div className={styles.inputGroup}>
                                    <label>C/O</label>
                                    <input
                                        type="number"
                                        value={editForm.co}
                                        onChange={e => setEditForm(prev => ({ ...prev, co: e.target.value === '' ? '' : Number(e.target.value) }))}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>BIN</label>
                                    <input
                                        type="number"
                                        value={editForm.bin}
                                        onChange={e => setEditForm(prev => ({ ...prev, bin: e.target.value === '' ? '' : Number(e.target.value) }))}
                                    />
                                </div>
                                <button onClick={() => saveEdit(listing.id)} className={styles.saveBtn}>Save</button>
                                <button onClick={() => setEditingId(null)} className={styles.cancelBtn}>Cancel</button>
                            </div>
                        ) : (
                            <div className={styles.prices}>
                                <p>C/O: ${listing.priceCurrentOffer?.toLocaleString() ?? 'N/A'}</p>
                                <p>BIN: ${listing.priceBin?.toLocaleString() ?? 'N/A'}</p>
                                <button onClick={() => startEdit(listing)} className={styles.editBtn}>Edit Prices</button>
                            </div>
                        )}

                        <div className={styles.actions}>
                            {listing.status === 'PENDING' && (
                                <>
                                    <button onClick={() => handleStatusUpdate(listing.id, 'APPROVED')} className={styles.approveBtn}>Approve</button>
                                    <button onClick={() => handleStatusUpdate(listing.id, 'REJECTED')} className={styles.rejectBtn}>Reject</button>
                                </>
                            )}
                            {listing.status === 'REJECTED' && (
                                <button onClick={() => handleStatusUpdate(listing.id, 'APPROVED')} className={styles.approveBtn}>Re-Approve</button>
                            )}
                            {listing.status === 'APPROVED' && (
                                <button onClick={() => handleStatusUpdate(listing.id, 'REJECTED')} className={styles.rejectBtn}>Un-list</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
