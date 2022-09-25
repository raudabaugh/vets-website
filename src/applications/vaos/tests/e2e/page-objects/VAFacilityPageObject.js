import PageObject from './PageObject';

class VAFacilityPageObject extends PageObject {
  assertUrl(url) {
    // cy.url().should('include', '/choose-facility');
    cy.url().should('include', url);
    cy.axeCheckBestPractice();

    return this;
  }

  assertNoHomeAddress() {
    cy.contains(/Note: to show facilities near your home/i);

    return this;
  }

  assertOneFacilityFound() {
    cy.contains(/We found one VA facility/);
    return this;
  }

  assertCernerRedirect() {
    cy.contains(/Schedule online at My VA Health/i);
    return this;
  }

  selectFacility() {
    cy.findByLabelText(/cheyenne/i).click();
    cy.findByText(/Continue/).click();

    return this;
  }

  selectVAFacility(label) {
    cy.url().should('include', '/va-facility-2');
    // cy.axeCheckBestPractice();
    cy.findByLabelText(label)
      .focus()
      .click();

    return this;
  }
}

export default new VAFacilityPageObject();
