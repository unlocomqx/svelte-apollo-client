import { gql, InMemoryCache } from "@apollo/client/core";
import { createMockClient } from "mock-apollo-client";
import { read } from "../__fixtures__/read";
import { SvelteApolloClient } from "../client";
import { Result } from "../observable";

describe("query", () => {
	it("should query data", async () => {
		const mockClient = createMockClient();

		const data = { dog: { id: 1, name: "Rufus", breed: "Poodle" } };

		const GET_DOG = gql`
			query GetDog($id: number!) {
				id
				breed
			}
		`;

		mockClient.setRequestHandler(GET_DOG, () => Promise.resolve({ data }));

		const client = new SvelteApolloClient({
			client: mockClient,
			cache: new InMemoryCache(),
		});

		const store = client._query(GET_DOG, {
			variables: { index: 4 },
		});

		const values = await read<Result<any>>(store);

		expect(values[0].loading).toBe(true);
		expect(values[1].data).toEqual(data);
	});
});
