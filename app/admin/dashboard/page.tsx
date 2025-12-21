import { redirect } from 'next/navigation';
import { checkAdminSession, getListings } from '../actions';
import DashboardContent from './DashboardContent';
import styles from './page.module.css';

export default async function AdminDashboard() {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) redirect('/admin/login');

    // Initial data fetch
    const listings = await getListings();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>
            </header>
            <main className={styles.main}>
                <DashboardContent initialListings={listings} />
            </main>
        </div>
    );
}
