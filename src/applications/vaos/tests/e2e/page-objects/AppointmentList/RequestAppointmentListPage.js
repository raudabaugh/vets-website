import { AppointmentListPage } from './AppointmentListPage';

class AppointmentRequestPageObject extends AppointmentListPage {
  constructor() {
    super({
      list: '[data-cy=requested-appointment-list]',
      listItem: '[data-cy=requested-appointment-list-item]',
    });

    // this.list = '[data-cy=requested-appointment-list]';
    // this.listItem = '[data-cy=requested-appointment-list-item]';
  }

  visit() {
    super.visit();

    cy.get('[data-testid="vaosSelect"]')
      .shadow()
      .find('#select')
      .select('requested')
      .should('have.value', 'requested');

    return this;
  }

  // clickDetails() {
  //   console.log(this.listItem);
  //   cy.get(this.listItem)
  //     .first()
  //     .findByText(/Details/i)
  //     .click({ waitForAnimations: true });
  //   cy.findByText(/Request detail/i).should('exist');

  //   return this;
  // }

  validate() {
    cy.get('[data-cy=requested-appointment-list-item]')
      .first()
      .should('exist');

    return this;
  }
}

const pageObjectInstance = new AppointmentRequestPageObject();
export default pageObjectInstance;
