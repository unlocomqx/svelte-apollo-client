<script lang="ts">
	import { gql } from "@apollo/client/core";
	import { client } from "../client";

	let users;

	function getUsers () {
		users = client.query(gql`
      query {
				userMany(limit: 10){
					name,
					age
				}
			}
    `);
	}

	$: users && console.log($users)
</script>

<button on:click={getUsers} data-cy="query">Get users</button>

{#if users}
	{#if $users.loading}
		Loading...
	{:else if $users.error}
		Error: {$users.error.message}
	{:else}
		<ul data-cy="users">
			{#each $users.data.userMany as user}
				<li>
					{user.name} ({user.age} years old)
				</li>
			{/each}
		</ul>
	{/if}
{/if}
