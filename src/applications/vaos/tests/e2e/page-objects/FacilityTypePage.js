import PageObject from './PageObject';

class FacilityType extends PageObject {
  assertUrl() {
    cy.url().should('include', '/choose-facility-type');
    cy.axeCheckBestPractice();
    return this;
  }

  selectFacility(label) {
    cy.findByLabelText(label).click();

    return this;
  }
}

export default new FacilityType();
