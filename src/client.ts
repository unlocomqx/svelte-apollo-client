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
	private _client: ApolloClient<T>;

	constructor(options: SvelteApolloClientOption<T>) {
		super(options);
		// allow the use of a custom client
		this._client = options?.client ?? (this as any);
	}

	// @ts-ignore to force this override
	public query<TData = unknown, TVariables = unknown>(
		query: DocumentNode,
		options?: Omit<WatchQueryOptions<TVariables, TData>, "query">
	): ReadableQuery<TData> {
		return svelteQuery(this._client, query, options);
	}

	// @ts-ignore to force this override
	public mutate<T = unknown, TVariables = unknown>(
		mutation: DocumentNode,
		options: MutateOptions<T, TVariables>
	): Promise<FetchResult<T>> {
		return this._client.mutate({ mutation, ...options });
	}

	// @ts-ignore
	public restore<TData = unknown, TVariables = OperationVariables>(
		query: DocumentNode,
		options: Omit<DataProxy.WriteQueryOptions<TData, TVariables>, "query">
	): void {
		return restore(this._client, query, options);
	}

	// @ts-ignore
	public subscribe<TData = unknown, TVariables = unknown>(
		query: DocumentNode,
		options: Omit<SubscriptionOptions<TVariables>, "query"> = {}
	): ReadableResult<TData> {
		return subscribe(this._client, query, options);
	}
}
