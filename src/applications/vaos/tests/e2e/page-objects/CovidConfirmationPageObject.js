import { ConfirmationPageObject } from './ConfirmationPageObject';

class CovidConfirmationPage extends ConfirmationPageObject {
  assertPage() {
    cy.findByText('We’ve scheduled and confirmed your appointment.');
    cy.findAllByText('COVID-19 vaccine');
    cy.findByText('Clinic:');

    return this;
  }
}

export default new CovidConfirmationPage();
