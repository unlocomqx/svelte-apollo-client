import type { DataProxy, OperationVariables } from "@apollo/client";
import type { DocumentNode } from "graphql";
import { onMount } from "svelte";
import { SvelteApolloClient } from "./client";

export type Restoring<TCache> =
	| WeakSet<SvelteApolloClient<TCache>>
	| Set<SvelteApolloClient<TCache>>;

export const restoring: Restoring<unknown> =
	typeof WeakSet !== "undefined" ? new WeakSet() : new Set();

export function restore<TData = unknown, TVariables = OperationVariables> (
	client: SvelteApolloClient<any>,
	query: DocumentNode,
	options: Omit<DataProxy.WriteQueryOptions<TData, TVariables>, "query">
): void {

	restoring.add(client);
	afterHydrate(() => restoring.delete(client));

	client.writeQuery({ query, ...options });
}

function afterHydrate (callback: () => void): void {
	// Attempt to wait for onMount (hydration of current component is complete),
	// but if that fails (e.g. outside of component initialization)
	// wait for next event loop for hydrate to complete

	try {
		onMount(callback);
	} catch (_error) {
		setTimeout(callback, 1);
	}
}
