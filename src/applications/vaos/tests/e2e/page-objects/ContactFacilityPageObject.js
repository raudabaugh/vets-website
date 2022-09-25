import PageObject from './PageObject';

class ContactFacilityPageObject extends PageObject {
  visit() {
    cy.url().should('include', '/contact-facility');
    cy.axeCheckBestPractice();

    return this;
  }

  clickNextButton() {
    cy.findByText(/Continue/i).should('not.exist');
    return this;
  }
}

export default new ContactFacilityPageObject();
