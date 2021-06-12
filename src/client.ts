import type {
	ApolloClientOptions,
	DataProxy,
	DocumentNode,
	FetchResult,
	OperationVariables,
	SubscriptionOptions,
	WatchQueryOptions
} from "@apollo/client";
import { ApolloClient } from "@apollo/client/core";
import { MutateOptions, mutation } from "./mutation";
import { ReadableQuery, ReadableResult } from "./observable";
import { query } from "./query";
import { restore } from "./restore";
import { subscribe } from "./subscribe";

export type SvelteApolloClientOption<T> = ApolloClientOptions<T> & { client?: ApolloClient<T> };

// @ts-ignore the query functions are not compatible
export interface SvelteApolloClient<T> extends ApolloClient<T> {

	query: <TData = unknown, TVariables = unknown>(
		query: DocumentNode,
		options: Omit<WatchQueryOptions<TVariables, TData>, "query">
	) => ReadableQuery<TData>,

	mutate: <T = unknown, TVariables = unknown> (
		options: MutateOptions<T, TVariables>
	) => Promise<FetchResult<T>>;

	restore: <TData = unknown, TVariables = OperationVariables>(
		query: DocumentNode,
		options: Omit<DataProxy.WriteQueryOptions<TData, TVariables>, "query">
	) => void

	subscribe: <TData = unknown, TVariables = unknown> (
		query: DocumentNode,
		options: Omit<SubscriptionOptions<TVariables>, "query">
	) => ReadableResult<TData>
}

export function SvelteApolloClient<T> (options: SvelteApolloClientOption<T>): SvelteApolloClient<T> {
	// If a client was passed in the options, use it. Otherwise create a new client
	let apolloClient = options?.client ?? new ApolloClient<T>(options);

	(apolloClient as any).query = function <TData = unknown, TVariables = unknown> (
		_query: DocumentNode,
		options: Omit<WatchQueryOptions<TVariables, TData>, "query"> = {}
	) {
		return query(apolloClient, _query, options);
	};

	(apolloClient as any).mutate = function <T = unknown, TVariables = unknown> (
		_mutation: DocumentNode
	) {
		return mutation(apolloClient, _mutation);
	};

	(apolloClient as any).restore = function <TData = unknown, TVariables = OperationVariables> (
		query: DocumentNode,
		options: Omit<DataProxy.WriteQueryOptions<TData, TVariables>, "query">
	) {
		return restore(apolloClient, query, options);
	};

	(apolloClient as any).subscribe = function <TData = unknown, TVariables = unknown> (
		query: DocumentNode,
		options: Omit<SubscriptionOptions<TVariables>, "query"> = {}
	) {
		return subscribe(apolloClient, query, options);
	};

	// @ts-ignore
	return (apolloClient as SvelteApolloClient<T>);
}