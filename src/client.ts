import type {
	ApolloClientOptions,
	DataProxy,
	DocumentNode,
	OperationVariables,
	SubscriptionOptions,
	WatchQueryOptions,
} from "@apollo/client";
import { FetchResult } from "@apollo/client";
import { ApolloClient } from "@apollo/client/core";
import { MutateOptions } from "./mutation";
import {
	observableToReadable,
	ReadableQuery,
	ReadableResult,
} from "./observable";
import { query } from "./query";
import { restore } from "./restore";

export type SvelteApolloClientOption<T> = ApolloClientOptions<T> & {
	client?: ApolloClient<T>;
};

// @ts-ignore the query functions are not compatible
export interface SvelteApolloClient<T> extends ApolloClient<T> {
	query: <TData = unknown, TVariables = unknown>(
		query: DocumentNode,
		options?: Omit<WatchQueryOptions<TVariables, TData>, "query">
	) => ReadableQuery<TData>;

	mutate: <T = unknown, TVariables = unknown>(
		mutation: DocumentNode,
		options?: MutateOptions<T, TVariables>
	) => Promise<FetchResult<T>>;

	restore: <TData = unknown, TVariables = OperationVariables>(
		query: DocumentNode,
		options?: Omit<DataProxy.WriteQueryOptions<TData, TVariables>, "query">
	) => void;

	subscribe: <TData = unknown, TVariables = unknown>(
		query: DocumentNode,
		options?: Omit<SubscriptionOptions<TVariables>, "query">
	) => ReadableResult<TData>;
}

export function SvelteApolloClient<T>(
	options: SvelteApolloClientOption<T>
): SvelteApolloClient<T> {
	// If a client was passed in the options, use it. Otherwise create a new client
	let apolloClient = options?.client ?? new ApolloClient<T>(options);

	(apolloClient as any).query = function <
		TData = unknown,
		TVariables = unknown
	>(
		_query: DocumentNode,
		options: Omit<WatchQueryOptions<TVariables, TData>, "query"> = {}
	) {
		return query(apolloClient as any, _query, options);
	};

	const originalMutateFn = apolloClient.mutate;

	(apolloClient as any).mutate = function <T = unknown, TVariables = unknown>(
		mutation: DocumentNode,
		options: MutateOptions<T, TVariables>
	) {
		return originalMutateFn({ mutation, ...options });
	};

	(apolloClient as any).restore = function <
		TData = unknown,
		TVariables = OperationVariables
	>(
		query: DocumentNode,
		options: Omit<DataProxy.WriteQueryOptions<TData, TVariables>, "query">
	) {
		return restore(apolloClient as any, query, options);
	};

	const _subscribe = (apolloClient as any).subscribe.bind(apolloClient);

	(apolloClient as any).subscribe = function <
		TData = unknown,
		TVariables = unknown
	>(
		query: DocumentNode,
		options: Omit<SubscriptionOptions<TVariables>, "query"> = {}
	) {
		const observable = _subscribe({
			query,
			...options,
		});

		return observableToReadable<TData>(observable);
	};

	// @ts-ignore
	return apolloClient as SvelteApolloClient<T>;
}
