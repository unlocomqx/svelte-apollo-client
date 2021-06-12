import { gql, InMemoryCache } from "@apollo/client/core";
import { SvelteApolloClient } from "../client";
import { restoring } from "../restore";

describe("query", () => {

	const MESSAGES = gql`
	query messages {
		message
	}
`;

	it("should restore client data", async () => {
		const client = SvelteApolloClient({
			cache: new InMemoryCache()
		});

		client.restore(MESSAGES, { data: { messages: [] } });

		expect(restoring.has(client)).toEqual(true);
	});
});
