'use client';

import { adminLogin } from '../actions';
import { useActionState } from 'react';
import styles from './page.module.css';

export default function AdminLogin() {
    const [state, formAction, isPending] = useActionState(adminLogin, null);

    return (
        <div className={styles.container}>
            <form action={formAction} className={styles.form}>
                <h1 className={styles.title}>Admin Access</h1>
                {state?.error && <div style={{ color: '#ef4444', textAlign: 'center' }}>{state.error}</div>}
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
                <button type="submit" className={styles.button} disabled={isPending}>
                    {isPending ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
