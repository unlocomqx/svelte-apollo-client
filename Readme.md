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

```js
client.query(document[, options
])
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

## Mutate

```js
client.mutate(document[, options
])
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
