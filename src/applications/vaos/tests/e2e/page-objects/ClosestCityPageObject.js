import PageObject from './PageObject';

class ClosestCity extends PageObject {
  assertUrl() {
    cy.url().should('include', 'choose-closest-city');
    cy.axeCheckBestPractice();

    return this;
  }

  selectFacility() {
    cy.findByLabelText(/cheyenne/i).click();
    // cy.findByText(/Continue/).click();

    return this;
  }
}

export default new ClosestCity();
