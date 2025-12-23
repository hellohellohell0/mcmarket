import styles from './GlassCard.module.css';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
}

export default function GlassCard({ children, className = '', hoverable = false }: GlassCardProps) {
    return (
        <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}>
            {children}
        </div>
    );
}
