/// <reference types="cypress" />

describe('Home', () => {
    beforeEach(() => {
        cy.visit('/movies/');
    });

    it('displays display a movies table', () => {
        cy.get('table')
            .should("exist")

        cy.get('table')
            .find("thead > tr")
            .children()
            .should("have.length", 6)

        cy.get('table')
            .find("tbody > tr")
            .first()
            .children()
            .should("have.length", 6)
    });

    it('filter by year', () => {
        cy.get('table')
            .find("input#year")
            .focus()
            .type("1986")

        cy.intercept("GET", "http://localhost:3131/movies*")
            .as("movies")

        cy.wait("@movies")

        cy.get('table')
            .find("tbody")
            .each(($tr) => {
                expect($tr.find("td").eq(0)).to.have.text("1986")
            })
    });

    it('filter by winners', () => {
        cy.get('table')
            .find("select#winner")
            .focus()
            .select("no")

        cy.intercept("GET", "http://localhost:3131/movies?winner=no")
            .as("loserMovies")

        cy.wait("@loserMovies")

        cy.get('table')
            .find("tbody")
            .children()
            .should("have.length", 1)

        cy.get('table')
            .find("select#winner")
            .focus()
            .select("yes")

        cy.intercept("GET", "http://localhost:3131/movies?winner=yes")
            .as("winnerMovies")

        cy.wait("@winnerMovies")

        cy.get('table')
            .find("tbody")
            .children()
            .should("have.length", 10)
    });
});
