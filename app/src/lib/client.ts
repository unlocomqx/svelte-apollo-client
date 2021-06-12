import { InMemoryCache } from "@apollo/client/cache";
import { SvelteApolloClient } from "svelte-apollo-client";

export const client = SvelteApolloClient({
	uri  : "https://48p1r2roz4.sse.codesandbox.io",
	cache: new InMemoryCache()
});
