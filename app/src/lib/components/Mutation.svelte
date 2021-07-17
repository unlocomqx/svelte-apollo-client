<script lang="ts">

	import { client } from "$lib/client";
	import { gql } from "@apollo/client/core";

	let loading = false;
	let shipName = "test";
	let order;

	async function createOrder () {
		loading = true;
		order = await client.mutate(gql`
      mutation createOrder($input: CreateOneOrderInput!) {
				createOrder(record: $input) {
					error {
						message
					}
					record {
						shipName
					}
				}
      }
    `, {
			variables: {
				input: {
					shipName
				}
			}
		});
		loading = false;
	}
</script>

<span>Ship name</span>
<input bind:value={shipName} />
<button on:click={createOrder}>Create order</button>

<p>
	{#if loading}
		loading...
	{:else}
		{#if order}
			Created new order: {order.data.createOrder.record.shipName}
		{/if}
	{/if}
</p>
