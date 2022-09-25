import { AppointmentListPage } from './AppointmentListPage';

export class CanceledAppointmentPage extends AppointmentListPage {
  visit() {
    super.visit();

    cy.get('[data-testid="vaosSelect"]')
      .shadow()
      .find('#select')
      .select('canceled')
      .should('have.value', 'canceled');
    // cy.get('h2').contains(/Canceled appointments/i);
    return this;
  }

  validate() {
    cy.get('[data-cy=canceled-appointment-list-header]').should('exist');
    cy.get('[data-cy=canceled-appointment-list]').should('exist');
    cy.get('[data-cy=appointment-list-item]')
      .first()
      .should('exist');

    return this;
  }

  clickDetails() {
    cy.get('[data-cy=appointment-list-item]')
      .first()
      .findByText(/Details/i)
      .focus()
      .click({ waitForAnimations: true });
    cy.findByText(/Appointment detail/i).should('exist');

    return this;
  }
}

const pageObjectInstance = new CanceledAppointmentPage();
export default pageObjectInstance;
