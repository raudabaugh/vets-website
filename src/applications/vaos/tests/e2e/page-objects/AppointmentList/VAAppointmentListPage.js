import { AppointmentListPage } from './AppointmentListPage';

export class VAAppointment extends AppointmentListPage {
  constructor() {
    super({
      list: '[data-cy=appointment-list]',
      listItem: '[data-cy=appointment-list-item]',
    });

    this.header = '[data-cy=va-appointment-details-header]';
    this.label = 'VA appointment';
  }

  cancelAppointment() {
    cy.findByText(/Cancel appointment/i).click();
    cy.findByText(/Yes, cancel this appointment/i).click();
    cy.findByTestId('cancel-appointment-SuccessModal').should('exist');
    cy.findByText(/Continue/i).click();
    cy.get('#cancelAppt').should('not.exist');
    cy.get('.usa-alert-success').should('not.exist');
    cy.get('.usa-alert-error').should('exist');

    return this;
  }

  selectListItem() {
    cy.get(this.listItem)
      .contains(/VA appointment/i)
      .parent()
      .findByText(/Details/i)
      .click();

    return this;
  }

  validate() {
    this._validateHeader();
    this._validateUrl();
  }

  _validateHeader() {
    cy.get('[data-cy=va-appointment-details-header]')
      .should('exist')
      .contains('VA appointment');

    return this;
  }

  _validateUrl() {
    cy.url().should('include', '/appointments/va');
    return this;
  }
}

export default new VAAppointment();
