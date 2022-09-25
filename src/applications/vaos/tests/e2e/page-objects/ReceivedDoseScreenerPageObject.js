import PageObject from './PageObject';

class ReceivedDoseScreenerPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/confirm-doses-received');
    cy.axeCheckBestPractice();

    return this;
  }

  selectNo() {
    cy.get('#root_hasReceivedDoseNo')
      .focus()
      .click();
    return this;
  }

  selectYes() {
    cy.get('#root_hasReceivedDoseYes')
      .focus()
      .click();

    return this;
  }
}

export default new ReceivedDoseScreenerPageObject();
