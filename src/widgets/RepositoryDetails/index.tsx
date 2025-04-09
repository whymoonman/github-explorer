import {RepositoryDetails} from "../../shared/store/repositories.ts";
import styles from './styles.module.css';

interface RepositoryDetailsProps {
    repository: RepositoryDetails;
}

export const RepositoryDetailsComponent = ({repository}: RepositoryDetailsProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.name}>{repository.name}</h1>
                <div className={styles.stars}>⭐ {repository.stargazerCount}</div>
                <div className={styles.lastCommit}>
                    Last commit:{' '}
                    {repository.lastCommitDate
                        ? new Date(repository.lastCommitDate).toLocaleDateString()
                        : 'No data'}
                </div>
            </div>

            <div className={styles.owner}>
                {repository.owner.avatarUrl && (
                    <img
                        src={repository.owner.avatarUrl}
                        alt={repository.owner.login}
                        className={styles.avatar}
                    />
                )}
                <a
                    href={repository.owner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ownerLink}
                >
                    {repository.owner.login}
                </a>
            </div>

            {repository.description && (
                <div className={styles.description}>{repository.description}</div>
            )}

            {repository.languages.length > 0 && (
                <div className={styles.languages}>
                    <h2>Используемые языки:</h2>
                    <div className={styles.languageList}>
                        {repository.languages.map((language) => (
                            <span key={language} className={styles.language}>
                {language}
              </span>
                        ))}
                    </div>
                </div>
            )}

            <a
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
            >
                Open on GitHub
            </a>
        </div>
    )
}