# Svelte Apollo Client

[<img src="https://img.shields.io/npm/v/svelte-apollo-client">](https://www.npmjs.com/package/svelte-apollo-client)

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
import { InMemoryCache } from "@apollo/client/core";
import { SvelteApolloClient } from "svelte-apollo-client";

export const client = SvelteApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});
```

### Import the client in your component

```js
import { client } from "path/to/client";

// You can use svelte's setContext/getContext to make this client available to all sub-components
// If you only intend to use on client for your entire app, then importing this client directly is fine
```

## Query

Query an Apollo client, returning a readable store of result values.
Uses Apollo's [`watchQuery`](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.watchQuery),
for fetching from the network and watching the local cache for changes.
If the client is hydrating after SSR, it attempts a `readQuery` to synchronously check the cache for values.

```text
client.query(document[, options])
```

```svelte
<script>
  import { client } from "$lib/client";
  import { gql } from "@apollo/client/core";

  let rates;

  function getRates() {
    rates = client.query(gql`
      query GetRates {
        rates(currency: "USD") {
          currency,
          rate,
        }
      }
    `);
  }
</script>

<button on:click={getRates}>Get rates</button>

{#if rates}
  {#if $rates.loading}
    Loading...
  {:else if $rates.error}
    Error: {$rates.error.message}
  {:else}
    <ul>
      {#each $rates.data.rates.slice(0, 5) as rate}
        <li>
          1 USD = {rate.rate} {rate.currency}
        </li>
      {/each}
    </ul>
  {/if}
{/if}
```

Reactive variables are supported with `refetch`:

```svelte
<script>
  import { client } from "$lib/client";
  import { SEARCH_BY_AUTHOR } from "./queries";

  export let author;
  let search = "";

  const books = client.query(SEARCH_BY_AUTHOR, {
    variables: { author, search },
  });

  // `books` is refetched when author or search change
  $: books.refetch({ author, search });
</script>

Author: {author}
<label>Search <input type="text" bind:value="{search}" /></label>

<ul>
  {#if $books.loading}
    <li>Loading...</li>
  {:else if $books.error}
    <li>ERROR: {$books.error.message}</li>
  {:else if $books.data}
    {#each $books.data.books as book (book.id)}
      <li>{book.title}</li>
    {/each}
  {:else}
    <li>No books found</li>
  {/if}
</ul>
```

## Mutate

Prepare a GraphQL mutation with the Apollo client, using
Apollo's [mutate](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.mutate)
.

```text
client.mutate(document[, options])
```

```svelte
<script>
  import { gql } from '@apollo/client/core';
  import { client } from './graphql/client';

  let mutation;

  async function createCustomer () {
    mutation = null;
    mutation = await client.mutate(gql`mutation {
      customerCreate(
        input: {
          firstName: "name",
          lastName: "lastname",
          email: "email@email.com"
        }
      )
      {
        customer {
          id
          displayName
          email
        }
        userErrors {
          field
          message
        }
      }
    }`);
  }
</script>

<div>
  <button on:click={createCustomer}>Create customer</button>
  <div>
    {#if mutation}
      {#if mutation.data.customerCreate.customer}
        <ul>
          <li>ID: {mutation.data.customerCreate.customer.id}</li>
          <li>Customer: {mutation.data.customerCreate.customer.displayName}</li>
          <li>Email: {mutation.data.customerCreate.customer.email}</li>
        </ul>
      {:else if mutation.data.customerCreate.userErrors}
        <ul style="color: red">
          {#each mutation.data.customerCreate.userErrors as error}
            <li>{error.message}</li>
          {/each}
        </ul>
      {/if}
    {/if}
  </div>
</div>
```

## Subscribe

Subscribe using an Apollo client, returning a store that is compatible with `{#await $...}`. Uses
Apollo's [subscribe](https://www.apollographql.com/docs/react/api/apollo-client#ApolloClient.subscribe)
.

```text
client.subscribe(document[, options])
```

```svelte
<script>
  import { client } from './graphql/client';
  import { NEW_BOOKS } from "./queries";

  const newBooks = client.subscribe(NEW_BOOKS);
</script>

{#if $newBooks.loading}
  Waiting for new books...
{:else if $newBooks.data}
  New Book: {$newBooks.data.book}
{/if}
```

## Restore

Restore a previously executed query (e.g. via preload) into the Apollo cache.

```svelte
<script context="module">
  import { client } from "$lib/client";
  import { GET_BOOKS } from "./queries";

  export async function preload() {
    return {
      preloaded: await client.query({ query: GET_BOOKS }),
    };
  }
</script>

<script>
  import { client } from "$lib/client";

  export let preloaded;

  // Load preloaded values into client's cache
  client.restore(GET_BOOKS, preloaded);
</script>
```
