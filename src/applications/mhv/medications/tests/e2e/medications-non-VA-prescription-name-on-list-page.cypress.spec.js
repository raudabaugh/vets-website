import MedicationsSite from './med_site/MedicationsSite';

import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Download PDF on List Page', () => {
  it('visits download pdf on list page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();

    site.login();
    cy.visit('my-health/about-medications/');

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
    listPage.clickGotoMedicationsLink();
    listPage.verifyNonVAPrescriptionNameOnListPage();
  });
});
