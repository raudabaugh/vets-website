import PageObject from './PageObject';

class ContactInfoPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/contact-info');
    cy.axeCheckBestPractice();

    return this;
  }

  typeEmailAddress() {
    return this;
  }

  typePhoneNumber() {
    return this;
  }

  selectPreferredTime() {
    cy.findByLabelText(/Morning/).click();
    return this;
  }
}

export default new ContactInfoPageObject();
