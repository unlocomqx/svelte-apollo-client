import type { SubscriptionOptions } from "@apollo/client";
import { ApolloClient } from "@apollo/client/core";
import type { DocumentNode } from "graphql";
import type { ReadableResult } from "./observable";
import { observableToReadable } from "./observable";

export function subscribe<TData = unknown, TVariables = unknown>(
	client: ApolloClient<any>,
	query: DocumentNode,
	options: Omit<SubscriptionOptions<TVariables>, "query"> = {}
): ReadableResult<TData> {
	const observable = client.subscribe<TData, TVariables>({ query, ...options });

	return observableToReadable<TData>(observable);
}
