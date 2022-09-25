import PageObject from './PageObject';

class CommunityCarePreferencesPage extends PageObject {
  assertUrl() {
    cy.url().should('include', 'community-care-preferences');
    cy.axeCheckBestPractice();

    return this;
  }

  expandAccordian() {
    cy.findByText(/Choose a provider/).click();
    cy.axeCheckBestPractice();

    return this;
  }

  removeProvider(_label) {
    cy.contains('Selected provider');
    cy.findByText(/remove/i).click();
    cy.axeCheckBestPractice();
    cy.findByText(/Yes, remove provider/i).click();

    return this;
  }

  selectProvider(_label) {
    cy.findByLabelText(/doe, jane/i).click();
    cy.findByText(/Choose provider/i).click();
    cy.axeCheckBestPractice();
    cy.contains('Selected provider');

    return this;
  }
}

export default new CommunityCarePreferencesPage();
