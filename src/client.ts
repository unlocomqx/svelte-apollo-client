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
import { ReadableQuery, ReadableResult } from "./observable";
import { query as svelteQuery } from "./query";
import { restore } from "./restore";
import { subscribe } from "./subscribe";

export type SvelteApolloClientOption<T> = ApolloClientOptions<T> & {
	client?: ApolloClient<T>;
};

export class SvelteApolloClient<T> extends ApolloClient<T> {
	constructor(options: SvelteApolloClientOption<T>) {
		super(options);
	}

	// @ts-ignore to force this override
	public query<TData = unknown, TVariables = unknown>(
		query: DocumentNode,
		options?: Omit<WatchQueryOptions<TVariables, TData>, "query">
	): ReadableQuery<TData> {
		return svelteQuery(this, query, options);
	}

	// @ts-ignore to force this override
	public mutate<T = unknown, TVariables = unknown>(
		mutation: DocumentNode,
		options: MutateOptions<T, TVariables>
	): Promise<FetchResult<T>> {
		return super.mutate({ mutation, ...options });
	}

	// @ts-ignore
	public restore<TData = unknown, TVariables = OperationVariables>(
		query: DocumentNode,
		options: Omit<DataProxy.WriteQueryOptions<TData, TVariables>, "query">
	): void {
		return restore(this, query, options);
	}

	// @ts-ignore
	public subscribe<TData = unknown, TVariables = unknown>(
		query: DocumentNode,
		options: Omit<SubscriptionOptions<TVariables>, "query"> = {}
	): ReadableResult<TData> {
		return subscribe(this as ApolloClient<T>, query, options);
	}
}

export function _SvelteApolloClient<T>(
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
		return svelteQuery(apolloClient as any, _query, options);
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

	(apolloClient as any).subscribe = function <
		TData = unknown,
		TVariables = unknown
	>(
		query: DocumentNode,
		options: Omit<SubscriptionOptions<TVariables>, "query"> = {}
	) {
		return subscribe(apolloClient as any, query, options);
	};

	// @ts-ignore
	return apolloClient as SvelteApolloClient<T>;
}
