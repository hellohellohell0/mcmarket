import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

export default function Button({ children, variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
    return (
        <button
            className={`${styles.btn} ${styles[variant]} ${fullWidth ? styles.full : ''} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}
