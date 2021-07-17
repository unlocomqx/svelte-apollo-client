<script lang="ts">
	import { browser } from "$app/env";
	import { InMemoryCache } from "@apollo/client/cache";
	import { gql, HttpLink, split } from "@apollo/client/core";
	import { WebSocketLink } from "@apollo/client/link/ws";
	import { getMainDefinition } from "@apollo/client/utilities";
	import { SvelteApolloClient } from "svelte-apollo-client";

	const wsLink = browser ? new WebSocketLink({ // if you instantiate in the server, the error will be thrown
		uri    : `wss://graphql-compose.herokuapp.com/northwind`,
		options: {
			reconnect: true
		}
	}) : null;

	const httplink = new HttpLink({
		uri        : "https://graphql-compose.herokuapp.com/northwind/",
		credentials: "same-origin"
	});

	const link = browser ? split( //only create the split in the browser
		// split based on operation type
		({ query }) => {
			const { kind, operation } = getMainDefinition(query);
			return kind === "OperationDefinition" && operation === "subscription";
		},
		wsLink,
		httplink
	) : httplink;

	export const client = SvelteApolloClient({
		link,
		cache: new InMemoryCache()
	});


	let newOrders;

	function getRates () {
		newOrders = client.subscribe(gql`
      subscription {
      	orderCreated {
      		shipName
      	}
      }
    `);
	}

	$: newOrders && console.log($newOrders)
</script>

<button on:click={getRates}>Subscribe</button>
<span>(click the mutation button afterwards)</span>

{#if newOrders}
	<p>
		{#if $newOrders.loading}
			Waiting for new orders...
		{:else if $newOrders.data}
			New Order: {$newOrders.data.orderCreated.shipName}
		{/if}
	</p>
{/if}
