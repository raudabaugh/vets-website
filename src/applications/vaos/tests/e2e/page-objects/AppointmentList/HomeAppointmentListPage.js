import { AppointmentListPage } from './AppointmentListPage';

export class HomeAppointment extends AppointmentListPage {
  constructor() {
    super({
      list: '[data-cy=appointment-list]',
      listItem: '[data-cy=appointment-list-item]',
    });
  }

  selectListItem() {
    cy.get(this.listItem)
      .contains(/VA Video Connect at home/i)
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
    cy.get('[data-cy=va-video-appointment-details-header]')
      .should('exist')
      .contains(/VA Video Connect at home/i);

    // cy.get('h2', { timeout: Timeouts.slow })
    //   .should('be.visible')
    //   .and('contain', 'Cheyenne VA Medical Center');
    return this;
  }

  _validateUrl() {
    cy.url().should('include', '/appointments/va');

    return this;
  }
}

export default new HomeAppointment();
