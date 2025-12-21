'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import Button from '@/components/Shared/Button';
import styles from './dashboard.module.css';

interface ContactInfo {
    id: string;
    type: string;
    value: string;
}

export default function Dashboard() {
    const { user, refreshUser, loading } = useAuth();
    const [bio, setBio] = useState('');
    const [pfpUrl, setPfpUrl] = useState('');
    const [contactType, setContactType] = useState('Discord');
    const [contactValue, setContactValue] = useState('');
    const [contacts, setContacts] = useState<ContactInfo[]>([]);
    const [myListings, setMyListings] = useState([]);

    // Load extra profile data (contacts, listings)
    useEffect(() => {
        if (user) {
            setBio(user.bio || '');
            setPfpUrl(user.pfpUrl || '');
            fetchProfileData();
        }
    }, [user]);

    const fetchProfileData = async () => {
        // We need a route for full profile with sensitive info like contacts management
        // For now, I'll assumme I can fetch it or I need to create a new endpoint?
        // Actually, I can use a specific endpoint or add to /me? 
        // Let's create a quick client-side fetch helper because /me returns minimal info.
        // Wait, I implemented /me to return { user: { id, username, bio, pfpUrl } }.
        // I need contacts and listings. 
        // I will implement a fetch here using a new or existing helper.
        // For MVP, I'll just skip fetching if I don't have an endpoint ready and focus on Update functionality first? 
        // No, I need contacts to check listing eligibility.
        // I'll add a temporary endpoint for "my dashboard data" or extend /me or use /api/user/profile? 
        // Let's just fetch everything I can.
        // Actually, `user` in AuthContext is from /me which included simple data.
        // I'll add a helper to fetch full profile.

        // FETCH CONTACTS
        // I need an endpoint for GET /api/user/contact? No I only made POST/DELETE.
        // I should probably return contacts in /me or have a GET endpoint.
        // I'll just assume I can fetch them via a new helper or update /me?
        // Updating /me is cleaner. 
        // BUT I can't easily update /me file now without context switch.
        // I made a mistake not adding GET contacts.
        // Listing page fetches seller contact info.
        // I'll reuse that Logic or assume I can fetch my own listing to see contacts? No.

        // I'll make a dedicated function inside this component to fetch contacts if I can, but I don't have the API.
        // Okay, I will implement `GET /api/user/contact` quickly or just hack it:
        // Actually, `GET /api/user/profile`? 
        // Let's implement `GET /api/user/full-profile` in `app/api/user/full-dashboard/route.ts`.

        const res = await fetch('/api/user/dashboard-data'); // I will create this.
        if (res.ok) {
            const data = await res.json();
            setContacts(data.contacts);
            setMyListings(data.listings);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/user/profile', {
            method: 'POST',
            body: JSON.stringify({ bio, pfpUrl })
        });
        refreshUser();
    };

    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/user/contact', {
            method: 'POST',
            body: JSON.stringify({ type: contactType, value: contactValue })
        });
        setContactValue('');
        fetchProfileData();
    };

    const handleDeleteContact = async (id: string) => {
        await fetch('/api/user/contact', {
            method: 'DELETE',
            body: JSON.stringify({ id })
        });
        fetchProfileData();
    };

    const handleDeleteListing = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        await fetch(`/api/listings/${id}`, {
            method: 'DELETE'
        });
        fetchProfileData();
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!user) return <div className="container">Please login.</div>;

    return (
        <div className={`container ${styles.dashboard}`}>
            <div className={styles.header}>
                <h1>Dashboard</h1>
                <Link href="/dashboard/create" className="btn btn-primary">Sell Account</Link>
            </div>

            <div className={styles.grid}>
                <div className={styles.column}>
                    <section className={styles.section}>
                        <h2>Profile Settings</h2>
                        <form onSubmit={handleUpdateProfile} className={styles.form}>
                            <div className={styles.field}>
                                <label>Bio</label>
                                <textarea value={bio} onChange={e => setBio(e.target.value)} className={styles.input} />
                            </div>
                            <div className={styles.field}>
                                <label>PFP URL (from Minecraft skin or imgur)</label>
                                <input value={pfpUrl} onChange={e => setPfpUrl(e.target.value)} className={styles.input} />
                            </div>
                            <Button type="submit">Save Profile</Button>
                        </form>
                    </section>

                    <section className={styles.section}>
                        <h2>Contact Information</h2>
                        <p className={styles.hint}>You must add at least one contact method to sell accounts.</p>
                        <div className={styles.contactList}>
                            {contacts.map(c => (
                                <div key={c.id} className={styles.contactItem}>
                                    <span><b>{c.type}:</b> {c.value}</span>
                                    <button onClick={() => handleDeleteContact(c.id)} className={styles.deleteBtn}>×</button>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddContact} className={styles.addContactForm}>
                            <select value={contactType} onChange={e => setContactType(e.target.value)} className={styles.select}>
                                <option>Discord</option>
                                <option>Telegram</option>
                                <option>Email</option>
                            </select>
                            <input
                                value={contactValue}
                                onChange={e => setContactValue(e.target.value)}
                                placeholder="username#1234"
                                className={styles.input}
                                required
                            />
                            <Button type="submit" variant="outline">Add</Button>
                        </form>
                    </section>
                </div>

                <div className={styles.column}>
                    <section className={styles.section}>
                        <h2>My Listings ({myListings.length}/5)</h2>
                        {myListings.length === 0 ? (
                            <p className={styles.empty}>No listings yet.</p>
                        ) : (
                            <div className={styles.listingsList}>
                                {myListings.map((l: any) => (
                                    <div key={l.id} className={styles.listingRow}>
                                        <img
                                            src={`https://minotar.net/helm/${l.username}/32.png`}
                                            className={styles.listingSkin}
                                            alt={l.username}
                                        />
                                        <div>
                                            <div className={styles.listingName}>{l.username}</div>
                                            <div className={styles.listingPrice}>BIN: ${l.priceBin}</div>
                                        </div>
                                        <div className={styles.actions}>
                                            <Link href={`/listings/${l.id}`} className={styles.viewLink}>View</Link>
                                            <button onClick={() => handleDeleteListing(l.id)} className={styles.deleteBtn}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
