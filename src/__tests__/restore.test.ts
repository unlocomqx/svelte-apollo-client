import { gql, InMemoryCache } from "@apollo/client/core";
import { SvelteApolloClient } from "../client";
import { restoring } from "../restore";

describe("query", () => {
	it("should restore client data", async () => {
		const MESSAGES = gql`
			query messages {
				message
			}
		`;

		const client = new SvelteApolloClient({
			cache: new InMemoryCache(),
		});

		client.restore(MESSAGES, { data: { messages: [] } });

		expect(restoring.has(client as any)).toEqual(true);
	});
});
