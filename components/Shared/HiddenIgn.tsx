import styles from './HiddenIgn.module.css';

export default function HiddenIgn() {
    return (
        <span className={styles.hiddenIgn}>
            ?????
            <span className={styles.tooltip}>This IGN is hidden.</span>
        </span>
    );
}
