import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, { headers }) => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;

    if (!token) {
        console.error('GitHub token is not set. Please check your .env file.');
        throw new Error('GitHub token is not set');
    }

    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});