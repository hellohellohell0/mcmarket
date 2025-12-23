import styles from './GlassButton.module.css';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    fullWidth?: boolean;
}

export default function GlassButton({
    children,
    variant = 'primary',
    fullWidth,
    className = '',
    ...props
}: GlassButtonProps) {
    return (
        <button
            className={`${styles.btn} ${styles[variant]} ${fullWidth ? styles.full : ''} ${className}`}
            {...props}
        >
            <span className={styles.label}>{children}</span>
            <span className={styles.shine} />
        </button>
    );
}
