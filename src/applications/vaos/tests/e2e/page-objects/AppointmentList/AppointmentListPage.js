/* eslint-disable max-classes-per-file */
import Timeouts from 'platform/testing/e2e/timeouts';
import PageObject from '../PageObject';

export class AppointmentListPage extends PageObject {
  constructor({
    list = '[data-cy=upcoming-appointment-list]',
    listItem = '[data-cy=appointment-list-item]',
  } = {}) {
    super();

    this.list = list;
    this.listItem = listItem;
  }

  selectListItem() {
    cy.get(this.listItem)
      .first()
      .findByText(/Details/i)
      .click({ waitForAnimations: true });

    return this;
  }

  visit() {
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.axeCheckBestPractice();

    return this;
  }

  validate() {
    cy.get('h2', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('contain', 'Your appointments');
    cy.get('[data-cy=upcoming-appointment-list-header]').should('exist');
    cy.get('[data-cy=upcoming-appointment-list]').should('exist');

    // TODO: Not sure about this!
    cy.get('[data-testid="vaosSelect"]').should('be.visible');
    cy.get('[data-cy=appointment-list-item]')
      .first()
      .should('exist');
    cy.axeCheckBestPractice();

    return this;
  }

  // selectAppointmentType() {
  //   cy.get(this.list).should('exist');
  //   cy.get(this.listItem)
  //     .first()
  //     .should('exist');

  //   return this;
  // }

  scheduleAppointment() {
    cy.findByText('Start scheduling').click({ waitForAnimations: true });
    return this;
  }
}

export default new AppointmentListPage();
