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
			.get("p")
			.contains("Created new order: ship");
	});

	it.only("should subscribe to data", () => {
		cy.get("[data-cy=shipName]")
			.clear()
			.type("ship")
			.get("[data-cy=mutate]")
			.click()
			.get("p")
			.contains("Created new order: ship");
	});
});
