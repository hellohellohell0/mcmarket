'use client';

import { adminLogin } from '../actions';
import { useActionState } from 'react';
import styles from './page.module.css';

export default function AdminLogin() {
    // Correct usage of useActionState might depend on Next.js version (14/15?).
    // Fallback to simple form submission if hook is tricky, but let's try standard approach or just a refined handleSubmit.

    // Using a simpler client-side wrapper for the server action to handle redirect/error
    // But since adminLogin redirects on success, we just need to handle error return.

    return (
        <div className={styles.container}>
            <form action={adminLogin} className={styles.form}>
                <h1 className={styles.title}>Admin Access</h1>
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    className={styles.input}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>Login</button>
            </form>
        </div>
    );
}
