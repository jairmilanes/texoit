/// <reference types="cypress" />

describe('Home', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays list years with multiple winners', () => {
    cy.get('div[data-id="enyr-container"]')
        .should("exist")
        .find("table")
        .should("exist")

    cy.get('div[data-id="enyr-container"]')
        .find("thead > tr")
        .children()
        .should("have.length", 2)

    cy.get('div[data-id="enyr-container"]')
        .find("tbody > tr")
        .first()
        .children()
        .should("have.length", 2)
  });

  it('displays top 3 studios', () => {
    cy.get('div[data-id="tpst-container"]')
        .should("exist")
        .find("table")
        .should("exist")

    cy.get('div[data-id="tpst-container"]')
        .find("thead > tr")
        .children()
        .should("have.length", 2)

    cy.get('div[data-id="tpst-container"]')
        .find("tbody > tr")
        .first()
        .children()
        .should("have.length", 2)
  });

  it('displays longest and shortest intervals', () => {
    cy.get('div[data-id="prmin-container"]')
        .should("exist")
        .find("table")
        .should("exist")

    cy.get('div[data-id="prmin-container"]')
        .find("table")
        .first()
        .find("thead > tr")
        .children()
        .should("have.length", 4)

    cy.get('div[data-id="prmin-container"]')
        .find("table")
        .first()
        .find("tbody > tr")
        .first()
        .children()
        .should("have.length", 4)

    cy.get('div[data-id="prmin-container"]')
        .find("table")
        .last()
        .find("thead > tr")
        .children()
        .should("have.length", 4)

    cy.get('div[data-id="prmin-container"]')
        .find("table")
        .last()
        .find("tbody > tr")
        .first()
        .children()
        .should("have.length", 4)
  });

  it('displays list movies by year', () => {
    cy.get('div[data-id="byyr-container"]')
        .should("exist")
        .find("table")
        .should("exist")

    cy.get('div[data-id="byyr-container"]')
        .find("thead > tr")
        .children()
        .should("have.length", 3)

    cy.get('div[data-id="byyr-container"]')
        .find("tbody > tr")
        .first()
        .children()
        .should("have.length", 3)
  });
});
