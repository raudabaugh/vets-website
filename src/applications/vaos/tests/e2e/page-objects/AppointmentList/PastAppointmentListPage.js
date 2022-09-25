import { AppointmentListPage } from './AppointmentListPage';

class PastAppointmentPageObject extends AppointmentListPage {
  constructor() {
    super();

    this.list = '[data-cy=past-appointment-list]';
    this.listItem = '[data-cy=appointment-list-item]';
  }

  visit() {
    super.visit();
    cy.get('[data-testid="vaosSelect"]')
      .shadow()
      .find('#select')
      .select('past')
      .should('have.value', 'past');

    cy.get('#date-dropdown')
      .shadow()
      .findByLabelText(/Select a date range/i)
      .should('exist');

    return this;
  }

  selectAppointmentType() {
    cy.get(this.list).should('exist');
    cy.get(this.listItem)
      .first()
      .should('exist');

    return this;
  }

  selectDateRange() {
    cy.get('#date-dropdown')
      .shadow()
      .find('#select')
      .select('1')
      .should('have.value', '1');

    return this;
  }

  clickUpdateButton() {
    cy.get('button')
      .contains(/Update/i)
      .click();
    cy.get('h3').should('exist');

    return this;
  }

  clickDetails() {
    cy.get(this.listItem)
      .first()
      .findByText(/Details/i)
      .click({ waitForAnimations: true });
    cy.findByText(/Appointment detail/i).should('exist');

    return this;
  }

  validate() {
    cy.get('[data-cy=past-appointment-list]').should('exist');
    cy.get('[data-cy=past-appointment-list-header]').should('exist');
    cy.get('[data-cy=appointment-list-item]')
      .first()
      .should('exist');

    return this;
  }

  validateDetailPage() {
    cy.findByText(/Appointment detail/i).should('exist');
    return this;
  }
}

const pageObjectInstance = new PastAppointmentPageObject();
export default pageObjectInstance;
