describe("Client test", () => {
	it("should query data", () => {
		cy.visit("/")
			.wait(1000)
			.get(`[data-cy=query]`)
			.click()
			.get("ul[data-cy=users] li")
			.should("have.length", 10);
	});

	it("should mutate data", () => {});
});
