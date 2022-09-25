import PageObject from './PageObject';

class EyeCarePage extends PageObject {
  assertUrl() {
    cy.url().should('include', '/choose-eye-care');
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

export default new EyeCarePage();
