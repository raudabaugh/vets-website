import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import onHoldPrescriptionDetails from './fixtures/active-on-hold-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Status DropDown', () => {
  it('visits Medications Details Page Active On Hold Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
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
    detailsPage.clickMedicationDetailsLink(onHoldPrescriptionDetails);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyOnHoldStatusDropDownDefinition();
  });
});
