import { InMemoryCache } from '@apollo/client/cache';
import { SvelteApolloClient } from 'svelte-apollo-client';

export const client = SvelteApolloClient({
	uri: 'https://graphql-compose.herokuapp.com/northwind/',
	cache: new InMemoryCache()
});
