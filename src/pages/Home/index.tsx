import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './styles.module.css'
import {Search} from "../../widgets/Search";
import RepositoryList from "../../widgets/RepositoryList";
import {Pagination} from "../../widgets/Pagination";
import {Repository} from "../../shared/store/repositories.ts";
import { useUnit } from 'effector-react';
import { $currentPage, $searchQuery, $isLoading, setPage, setSearchQuery } from '../../shared/store/repositories';

export const HomePage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = useUnit($currentPage);
    const searchQuery = useUnit($searchQuery);
    const isLoading = useUnit($isLoading);

    useEffect(() => {
        const page = searchParams.get('page');
        const query = searchParams.get('q');
        
        if (page) {
            setPage(Number(page));
        }
        setSearchQuery(query || '');
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) {
            params.set('page', currentPage.toString());
        }
        if (searchQuery) {
            params.set('q', searchQuery);
        }
        setSearchParams(params);
    }, [currentPage, searchQuery]);

    const handleRepositoryClick = (repository: Repository) => {
        const [owner, repoName] = repository.name.split('/');
        if (owner && repoName) {
            navigate(`/repository/${owner}/${repoName}`);
        } else {
            console.error('Invalid repository name format:', repository.name);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>GitHub Explorer</h1>
            <Search />
            <RepositoryList onRepositoryClick={handleRepositoryClick} />
            {!isLoading && <Pagination />}
        </div>
    )
}