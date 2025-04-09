import {$isLoading, $repositories, Repository} from "../../shared/store/repositories.ts";
import {useUnit} from "effector-react";
import styles from './styles.module.css';

interface RepositoryListProps {
    onRepositoryClick: (repository: Repository) => void;
}

const RepositoryList = ({onRepositoryClick}: RepositoryListProps) => {
    const repositories = useUnit($repositories);
    const isLoading = useUnit($isLoading);

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>
    }

    if (repositories.length === 0) {
        return <div className={styles.empty}>Repositories not found</div>
    }

    return (
        <div className={styles.list}>
            {repositories.map((repository: Repository) => (
                <div
                    key={repository.id}
                    className={styles.item}
                    onClick={() => onRepositoryClick(repository)}
                >
                    <div className={styles.name}>{repository.name}</div>
                    {repository.description && (
                        <div className={styles.description}>
                            {repository.description}
                        </div>
                    )}
                    <div className={styles.metadata}>
                        <span>⭐ {repository.stargazerCount}</span>
                        <span>
                            Last commit: {' '}
                            {repository.lastCommitDate
                                ? new Date(repository.lastCommitDate).toLocaleDateString()
                                : 'No data'
                            }
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RepositoryList;