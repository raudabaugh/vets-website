import PageObject from './PageObject';

class TypeOfVisitPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/choose-visit-type');
    cy.axeCheckBestPractice();

    return this;
  }

  selectVisitType() {
    cy.get('#root_visitType_0')
      .focus()
      .click();

    return this;
  }
}

export default new TypeOfVisitPageObject();
