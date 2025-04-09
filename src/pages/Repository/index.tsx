import {useNavigate, useParams} from "react-router-dom";
import {RepositoryDetails} from "../../shared/store/repositories.ts";
import {useEffect, useState} from "react";
import {GET_REPOSITORY} from "../../shared/api/queries.ts";
import {client} from "../../shared/api/github.ts";
import styles from './styles.module.css';
import {RepositoryDetailsComponent} from "../../widgets/RepositoryDetails";

export const RepositoryPage = () => {
    const {owner, name} = useParams<{ owner: string, name: string }>();
    const navigate = useNavigate();
    const [repository, setRepository] = useState<RepositoryDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepository = async () => {
            if (!owner || !name) {
                setError('Repository owner or name is missing');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const result = await client.query({
                    query: GET_REPOSITORY,
                    variables: {
                        owner,
                        name
                    },
                });

                if (result.errors) {
                    throw new Error(result.errors[0].message);
                }

                if (!result.data.repository) {
                    throw new Error('Repository not found');
                }

                const repo = result.data.repository;

                setRepository({
                    ...repo,
                    languages: repo.languages.edges.map((edge: any) => edge.node.name),
                });
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Error loading the repository');
            } finally {
                setLoading(false);
            }
        };

        fetchRepository();
    }, [owner, name]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }

    if (!repository) {
        return (
            <div className={styles.error}>
                <p>Repository not found</p>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                Back
            </button>
            <RepositoryDetailsComponent repository={repository}/>
        </div>
    );
};