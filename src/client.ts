import { ApolloClient, ApolloClientOptions } from "@apollo/client/core";

export function SvelteApolloClient<T> (options: ApolloClientOptions<T>) {
  const apolloClient = new ApolloClient<T>(options);

  return apolloClient;
}
