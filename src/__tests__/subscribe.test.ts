import { gql, InMemoryCache, Observable } from "@apollo/client/core";
import { read } from "../__fixtures__/read";
import { SvelteApolloClient } from "../client";
import { observableToReadable } from "../observable";

describe("query", () => {
	it("should subscribe to client data", async () => {
		const NEW_MESSAGES = gql`
			subscription newMessages {
				message
			}
		`;

		const client = SvelteApolloClient({
			cache: new InMemoryCache(),
		});

		(client as any).subscribe = () => {
			return observableToReadable(
				Observable.of({ data: 1 }, { data: 2 }, { data: 3 })
			);
		};

		const store = client.subscribe(NEW_MESSAGES);

		const values = await read(store);
		expect(values[0].loading).toEqual(true);
		expect(values[1].data).toEqual(1);
		expect(values[2].data).toEqual(2);
		expect(values[3].data).toEqual(3);
	});
});
