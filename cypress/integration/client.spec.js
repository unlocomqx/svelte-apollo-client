describe("Client test", () => {
	beforeEach(() => {
		cy.visit("/").wait(1000);
	});

	it("should query data", () => {
		cy.get(`[data-cy=query]`)
			.click()
			.get("ul[data-cy=users] li")
			.should("have.length", 10);
	});

	it("should mutate data", () => {
		cy.get("[data-cy=shipName]")
			.clear()
			.type("ship")
			.get("[data-cy=mutate]")
			.click()
			.get("p[data-cy=mutate_result]")
			.contains("Created new order: ship");
	});

	it("should subscribe to data", () => {
		cy.get(`[data-cy=subscribe]`)
			.click()
			.get("[data-cy=shipName]")
			.clear()
			.type("ship")
			.get("[data-cy=mutate]")
			.click()
			.get("p[data-cy=subscribe_result]")
			.contains("New Order: ship");
	});
});
