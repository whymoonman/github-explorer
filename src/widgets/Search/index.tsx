import {setSearchQuery} from "../../shared/store/repositories.ts";
import {useEffect, useState} from "react";
import styles from "./styles.module.css";

export const Search = () => {
    const [localQuery, setLocalQuery] = useState('');
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timer) {
            clearTimeout(timer);
        }

        const newTimer = setTimeout(() => {
            setSearchQuery(localQuery);
        }, 500);

        setTimer(newTimer);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [localQuery]);

    const handleClear = () => {
        setLocalQuery('');
        setSearchQuery('');
    };

    return (
        <div className={styles.search}>
            <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search repositories..."
                className={styles.input}
            />
            {localQuery && (
                <button
                    className={styles.clearButton}
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    ×
                </button>
            )}
        </div>
    )
}