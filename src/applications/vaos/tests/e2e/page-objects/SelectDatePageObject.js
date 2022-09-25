import PageObject from './PageObject';

class SelectDatePageObject extends PageObject {
  assertUrl() {
    cy.url().should('include', '/select-date');
    cy.axeCheckBestPractice();

    return this;
  }

  selectNextMonth() {
    cy.contains('button', 'Next')
      .should('not.be.disabled')
      .focus()
      .click();

    return this;
  }

  selectPreviousMonth() {
    return this;
  }

  selectFirstAvailableDate() {
    cy.get(
      '.vaos-calendar__calendars button[id^="date-cell"]:not([disabled])',
    ).click();
    cy.get(
      '.vaos-calendar__day--current .vaos-calendar__options input[id$="_0"]',
    ).click();

    return this;
  }
}

export default new SelectDatePageObject();
