import {$currentPage, $totalPages, setPage} from "../../shared/store/repositories.ts";
import {useUnit} from "effector-react";
import styles from './styles.module.css';

export const Pagination = () => {
    const currentPage = useUnit($currentPage);
    const totalPages = useUnit($totalPages);

    if (totalPages < 1) {
        return null;
    }

    const pages = Array.from({length: Math.min(totalPages, 10)}, (_, i) => {
        let pageNumber;

        if (totalPages <= 10) {
            pageNumber = i + 1;
        } else if (currentPage <= 5) {
            pageNumber = i + 1;
        } else if (currentPage >= totalPages - 4) {
            pageNumber = totalPages - 9 + i;
        } else {
            pageNumber = currentPage - 5 + i;
        }

        return pageNumber;
    });

    return(
        <div className={styles.pagination}>
            {currentPage > 1 && (
                <button
                    className={styles.button}
                    onClick={() => setPage(currentPage - 1)}
                >
                    Back
                </button>
            )}
            {pages.map((page) => (
                <button
                    key={page}
                    className={`${styles.button} ${page === currentPage ? styles.active : ''}`}
                    onClick={() => setPage(page)}
                >
                    {page}
                </button>
            ))}
            {currentPage < totalPages && (
                <button
                    className={styles.button}
                    onClick={() => setPage(currentPage + 1)}
                >
                    Next
                </button>
            )}
        </div>
    )
}