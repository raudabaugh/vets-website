import Timeouts from 'platform/testing/e2e/timeouts';
import PageObject from './PageObject';

class TypeOfCarePage extends PageObject {
  assertUrl() {
    cy.url().should('include', '/new-appointment', { timeout: Timeouts.slow });
    cy.axeCheckBestPractice();
    return this;
  }

  selectTypeOfCare(label) {
    cy.findByLabelText(label)
      .focus()
      .click();

    return this;
  }
}

export default new TypeOfCarePage();
