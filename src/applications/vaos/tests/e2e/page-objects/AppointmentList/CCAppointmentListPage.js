import { AppointmentListPage } from './AppointmentListPage';

export class CCAppointment extends AppointmentListPage {
  constructor() {
    super({
      list: '[data-cy=appointment-list]',
      listItem: '[data-cy=appointment-list-item]',
    });
  }

  validate() {
    this._validateHeader();
    this._validateUrl();
  }

  _validateHeader() {
    cy.get('[data-cy=community-care-appointment-details-header]')
      .should('exist')
      .contains('Community care');

    return this;
  }

  _validateUrl() {
    cy.url().should('include', '/appointments/cc');
    cy.axeCheckBestPractice();

    return this;
  }
}

export default new CCAppointment();
