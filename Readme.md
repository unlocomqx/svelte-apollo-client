# Svelte Apollo Client

Svelte integration for Apollo GraphQL.

Heavily based on [svelte apollo](https://github.com/timhall/svelte-apollo)

## Install

```shell
yarn add svelte-apollo-client
```

### Additional packages (Peer dependencies)

```shell
yarn add @apollo/client graphql
```

## The client

### Create the client

```js
// client.ts
import { InMemoryCache } from '@apollo/client/core';
import { SvelteApolloClient } from 'svelte-apollo-client';

export const client = SvelteApolloClient({
	uri: '/graphql',
	cache: new InMemoryCache()
});
```

### Import the client in your component

```js
import { client } from 'path/to/client';

// You can use svelte's setContext/getContext to make this client available to all sub-components
// If you only intend to use on client for your entire app, then importing this client directly is fine
```

## Query

```sveltehtml

<script>
	import { client } from 'path/to/client';
	import { gql } from '@apollo/client/core';

	let products;

	function getProducts() {
		products = client.query(gql`
    query {
      products (first: 5) {
        edges {
        node {
            id
            title
          }
        }
      }
    }
  `);
	}
</script>

<button on:click={getProducts}>Get the list of products using GraphQL</button>

{#if products}
	{#if $products.loading}
		Loading...
	{:else if $products.error}
		Error: {$products.error.message}
	{:else}
		<ul>
			{#each $products.data.products.edges as product}
				<li>
					Product: {product.node.title}
				</li>
			{/each}
		</ul>
	{/if}
{/if}
```
