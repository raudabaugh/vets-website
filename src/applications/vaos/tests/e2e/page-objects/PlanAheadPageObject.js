import PageObject from './PageObject';

class PlanAheadPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/new-covid-19-vaccine-appointment');
    cy.axeCheckBestPractice();

    return this;
  }
}

export default new PlanAheadPageObject();
