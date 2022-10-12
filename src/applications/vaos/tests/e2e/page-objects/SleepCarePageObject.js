import PageObject from './PageObject';

class ChooseSleepCarePage extends PageObject {
  assertUrl() {
    cy.url().should('include', '/choose-sleep-care');
    cy.axeCheckBestPractice();

    return this;
  }

  selectTypeOfCare(label) {
    cy.findByLabelText(label)
      .focus()
      .click();

    return this;
  }
}

export default new ChooseSleepCarePage();
