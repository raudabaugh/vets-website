import PageObject from './PageObject';

class AudiologyPageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', 'audiology');
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

export default new AudiologyPageObject();
