export default class PageObject {
  clickNextButton(label = 'Continue') {
    cy.contains('button', label)
      .should('not.be.disabled')
      .focus()
      .click({ waitForAnimations: true });

    return this;
  }

  validate() {
    this._validateUrl();
    this._validateHeader();
    return this;
  }

  _validateUrl() {
    return this;
  }

  _validateHeader() {
    return this;
  }
}
