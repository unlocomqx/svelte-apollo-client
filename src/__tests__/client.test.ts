import { HttpLink, InMemoryCache } from "@apollo/client/core";
import fetch from "cross-fetch";
import { SvelteApolloClient } from "../client";

describe("client", () => {
  it("should create svelte apollo client", () => {
    const client = SvelteApolloClient({
      link : new HttpLink({ uri: "https://48p1r2roz4.sse.codesandbox.io", fetch }),
      cache: new InMemoryCache()
    });

    expect(typeof client).toBe("object");
    expect(typeof client.query).toBe("function");
    expect(typeof client.mutate).toBe("function");
    expect(typeof client.restore).toBe("function");
    expect(typeof client.subscribe).toBe("function");
  });
});
