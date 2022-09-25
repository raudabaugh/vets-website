import PageObject from './PageObject';

class SecondDosePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/second-dose-info');
    cy.axeCheckBestPractice();

    return this;
  }
}

export default new SecondDosePageObject();
