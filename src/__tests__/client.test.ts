import { HttpLink, InMemoryCache } from "@apollo/client/core";
import { SvelteApolloClient } from "../client";

describe("client", () => {
	it("should create svelte apollo client", () => {
		const client = new SvelteApolloClient({
			link: new HttpLink({
				uri: "/",
				fetch: () => {},
			}),
			cache: new InMemoryCache(),
		});

		expect(typeof client).toBe("object");
		expect(typeof client.query).toBe("function");
		expect(typeof client.mutate).toBe("function");
		expect(typeof client.restore).toBe("function");
		expect(typeof client.subscribe).toBe("function");
	});
});
