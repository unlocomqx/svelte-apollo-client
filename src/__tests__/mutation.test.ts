import { gql, InMemoryCache } from "@apollo/client/core";
import { createMockClient } from "mock-apollo-client";
import { SvelteApolloClient } from "../client";

describe("mutation", () => {
	it("should mutate data", async () => {
		const mockClient = createMockClient();

		const data = { success: 1 };

		const SEND_MESSAGE = gql`
			mutation sendMessage($message: String!) {
				sendMessage(message: $message) {
					messages
				}
			}
		`;

		mockClient.setRequestHandler(
			SEND_MESSAGE,
			() => Promise.resolve({ data }));

		const client = SvelteApolloClient({
			client: mockClient,
			cache : new InMemoryCache()
		});

		const result = await client.mutate(SEND_MESSAGE, {
			variables: { message: "Howdy!" }
		});

		expect(result.data).toEqual({ success: 1 });
	});
});
