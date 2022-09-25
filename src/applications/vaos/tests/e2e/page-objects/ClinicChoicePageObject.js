import Timeouts from 'platform/testing/e2e/timeouts';
import PageObject from './PageObject';

class ClinicChoicePageObject extends PageObject {
  assertUrl(url) {
    cy.url().should('include', url, { timeout: Timeouts.slow });
    cy.axeCheckBestPractice();

    return this;
  }

  selectClinic() {
    // cy.findByText(/Choose where you’d like to get your vaccine/);
    // cy.findByText(label);
    cy.get('#root_clinicId_0')
      .focus()
      .click();

    // cy.url().should('include', '/clinics');
    // cy.axeCheckBestPractice();
    // cy.findByText(
    //   /Choose a clinic below or request a different clinic for this appointment/i,
    // );
    // cy.get('#root_clinicId_0')
    //   .focus()
    //   .click();

    return this;
  }
}

export default new ClinicChoicePageObject();
