<script lang="ts">

	import { client } from "$lib/client";
	import { gql } from "@apollo/client/core";

	let rates;

	function getRates () {
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
