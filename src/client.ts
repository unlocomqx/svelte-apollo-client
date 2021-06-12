import type {
	ApolloClientOptions,
	DataProxy,
	DocumentNode,
	OperationVariables,
	SubscriptionOptions,
	WatchQueryOptions
} from "@apollo/client";
import { ApolloClient } from "@apollo/client/core";
import { mutation } from "./mutation";
import { query } from "./query";
import { restore } from "./restore";
import { subscribe } from "./subscribe";

export function SvelteApolloClient<T> (options: ApolloClientOptions<T>) {
	const apolloClient = new ApolloClient<T>(options);

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

	return apolloClient;
}
