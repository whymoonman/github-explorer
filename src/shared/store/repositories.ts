import {createEffect, createEvent, createStore, sample} from "effector";
import {client} from "../api/github.ts";
import {SEARCH_REPOSITORIES} from "../api/queries.ts";

export interface Repository {
    id: string;
    name: string;
    description: string | null;
    stargazerCount: number;
    url: string;
    owner: {
        login: string;
        avatarUrl: string | null;
    };
    lastCommitDate: string | null;
}

export interface RepositoryDetails extends Repository {
    owner: {
        login: string;
        avatarUrl: string | null;
        url: string;
    };
    languages: string[];
}

export const $repositories = createStore<Repository[]>([]);
export const $currentPage = createStore<number>(1);
export const $searchQuery = createStore<string>('');
export const $totalPages = createStore<number>(0);
export const $isLoading = createStore<boolean>(false);
export const $error = createStore<string | null>(null);

export const setSearchQuery = createEvent<string>();
export const setPage = createEvent<number>();
export const setError = createEvent<string | null>();

const searchRepositoriesFx = createEffect(async (params: { query: string, page: number }) => {
    try {
        const {query, page} = params;
        
        // Если запрос пустой, возвращаем пустой результат
        if (!query.trim()) {
            return {
                repositories: [],
                totalCount: 0
            };
        }

        const first = 10;
        const after = page > 1 ? btoa(`cursor:${(page - 1) * first}`) : null;

        const result = await client.query({
            query: SEARCH_REPOSITORIES,
            variables: {
                query: `in:name ${query}`,
                first,
                after
            }
        });

        if (result.errors) {
            throw new Error(result.errors[0].message);
        }

        return {
            repositories: result.data.search.edges.map((edge: any) => ({
                id: edge.node.id,
                name: `${edge.node.owner.login}/${edge.node.name}`,
                description: edge.node.description,
                stargazerCount: edge.node.stargazerCount,
                url: edge.node.url,
                owner: edge.node.owner,
                lastCommitDate: edge.node.defaultBranchRef?.target?.committedDate,
            })),
            totalCount: result.data.search.repositoryCount,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch repositories: ${error.message}`);
        }
        throw new Error('Failed to fetch repositories');
    }
});

// Запускаем поиск при изменении запроса или страницы
sample({
    clock: [setSearchQuery, setPage],
    source: {
        query: $searchQuery,
        page: $currentPage,
    },
    target: searchRepositoriesFx,
});

$repositories.on(searchRepositoriesFx.doneData, (_, {repositories}) => repositories);
$totalPages.on(searchRepositoriesFx.doneData, (_, {totalCount}) => Math.ceil(totalCount / 10));
$isLoading.on(searchRepositoriesFx.pending, (_, pending) => pending);
$isLoading.on(searchRepositoriesFx.failData, () => false);
$currentPage.on(setPage, (_, page) => page);
$searchQuery.on(setSearchQuery, (_, query) => query);
$error.on(searchRepositoriesFx.failData, (_, error) => error.message);
$error.on(setError, (_, error) => error);