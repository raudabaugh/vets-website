import prescriptions from '../fixtures/prescriptions.json';
import allergies from '../fixtures/allergies.json';
import parkedRx from '../fixtures/parked-prescription-details.json';
import activeRxRefills from '../fixtures/active-prescriptions-with-refills.json';
import emptyPrescriptionsList from '../fixtures/empty-prescriptions-list.json';
import nonVARx from '../fixtures/non-VA-prescription-on-list-page.json';

class MedicationsListPage {
  clickGotoMedicationsLink = (waitForMeds = false) => {
    // cy.intercept('GET', '/my-health/medications', prescriptions);
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.intercept(
      'GET',
      'my_health/v1/prescriptions?page=1&per_page=20&sort[]=-dispensed_date&sort[]=prescription_name',
      prescriptions,
    ).as('medicationsList');
    cy.get('[data-testid ="prescriptions-nav-link"]').click({ force: true });
    if (waitForMeds) {
      cy.wait('@medicationsList');
    }
  };

  clickGotoMedicationsLinkforEmptyMedicationsList = () => {
    cy.intercept('GET', '/my_health/v1/medical_records/allergies', allergies);
    cy.intercept(
      'GET',
      'my_health/v1/prescriptions?page=1&per_page=20&sort[]=-dispensed_date&sort[]=prescription_name',
      emptyPrescriptionsList,
    );
    cy.get('[data-testid ="prescriptions-nav-link"]').click({ force: true });
  };

  verifyTextInsideDropDownOnListPage = () => {
    cy.contains(
      'If you print this page, it won’t include your allergies and reactions to medications.',
    );
  };

  clickWhatToKnowAboutMedicationsDropDown = () => {
    cy.contains('What to know before you download').click({
      force: true,
    });
  };

  verifyLearnHowToRenewPrescriptionsLinkExists = () => {
    cy.get('[data-testid="active-no-refill-left"]');
    cy.get('[data-testid="learn-to-renew-prescriptions-link"]').should('exist');
  };

  clickLearnHowToRenewPrescriptionsLink = () => {
    cy.get('[data-testid="active-no-refill-left"]');
    cy.get('[data-testid="learn-to-renew-prescriptions-link"]')

      .shadow()
      .find('[href="/my-health/about-medications/accordion-renew-rx"]')
      .click({ waitForAnimations: true });
  };

  clickPrintOrDownloadThisListDropDown = () => {
    cy.get('[data-testid="print-records-button"] > span').click({
      force: true,
    });
  };

  verifyPrintMedicationsListEnabledOnListPage = () => {
    cy.get('[class="menu-options menu-options-open"]').should(
      'contain',
      'Print list',
    );
    cy.contains('Print list').should('be.enabled');
  };

  verifyNavigationToListPageAfterClickingBreadcrumbMedications = () => {
    cy.get('[data-testid="list-page-title"]')
      .should('have.text', 'Medications')
      .should('be.visible');
  };

  verifyDownloadListAsPDFButtonOnListPage = () => {
    cy.get('[data-testid="download-pdf-button"]')
      .should('contain', 'Download your medication list as a PDF')
      .should('be.visible');
  };

  verifyInformationBasedOnStatusActiveNoRefillsLeft = () => {
    cy.get('[data-testid="active-no-refill-left"]')
      .should('be.visible')
      .and(
        'contain',
        'You have no refills left. If you need more, request a renewal.',
      );
    cy.get('[data-testid="learn-to-renew-prescriptions-link"]')
      .should('exist')
      .and('be.visible')
      .shadow()
      .should('have.text', 'Learn how to renew prescriptions');
  };

  verifyInformationBasedOnStatusActiveRefillInProcess = () => {
    cy.get('[data-testid="rx-refillinprocess-info"]')
      .should('exist')
      .and('be.visible')
      .and('contain', 'Refill in process. We expect to fill it on');
  };

  verifyInformationBasedOnStatusNonVAPrescription = () => {
    cy.get('[data-testid="rx-last-filled-info"]').should('be.visible');

    cy.get('[data-testid="non-VA-prescription"]')
      .should('be.visible')
      .and(
        'have.text',
        'This isn’t a prescription that you filled through a VA pharmacy. You can’t manage this medication in this online tool.',
      );
  };

  verifyInformationBasedOnStatusActiveParked = () => {
    cy.get(
      `#card-header-${
        parkedRx.data.id
      } > [data-testid="medications-history-details-link"]`,
    ).should('be.visible');
    cy.get(
      ':nth-child(5) > .rx-card-detials > :nth-child(2) > [data-testid="active-not-filled-rx"]',
    )
      .should('be.visible')
      .and('have.text', 'Not filled yet');
  };

  verifyInformationBasedOnStatusActiveOnHold = () => {
    cy.get('[data-testid="active-onHold"]')
      .should('be.visible')
      .and(
        'have.text',
        'We put a hold on this prescription. If you need it now, call your VA pharmacy.',
      );
  };

  verifyInformationBasedOnStatusDiscontinued = () => {
    cy.get('[data-testid="discontinued"]')
      .should('be.visible')
      .and(
        'have.text',
        'You can’t refill this prescription. If you need more, send a message to your care team.',
      );
  };

  verifyInformationBasedOnStatusExpired = () => {
    cy.get('[data-testid="expired"]')
      .should('be.visible')
      .and(
        'have.text',
        'This prescription is too old to refill. If you need more, request a renewal.',
      );
  };

  verifyInformationBasedOnStatusTransferred = () => {
    cy.get('[data-testid="transferred"]')
      .should('be.visible')
      .and(
        'have.text',
        'To manage this prescription, go to our My VA Health portal.',
      );
    cy.get('[data-testid="prescription-VA-health-link"]')
      .should('be.visible')
      .shadow()
      .should('have.text', 'Go to your prescription in My VA Health');
  };

  verifyInformationBasedOnStatusUnknown = () => {
    cy.get('[data-testid="unknown"] > div')
      .should('be.visible')
      .and(
        'have.text',
        'We’re sorry. There’s a problem with our system. You can’t manage this prescription online right now.Check back later. Or call your VA pharmacy.',
      );
  };

  verifyInformationBasedOnStatusActiveRefillsLeft = () => {
    cy.get(
      `[aria-describedby="card-header-${activeRxRefills.data.id}"]`,
    ).should('exist');
    //  cy.get(':nth-child(2) > .rx-card-detials > :nth-child(5) > [data-testid="refill-request-button"]')
    cy.get(
      ':nth-child(2) > .rx-card-detials > :nth-child(2) > [data-testid="active-not-filled-rx"]',
    ).should('have.text', 'Not filled yet');
    cy.get(':nth-child(2) > .rx-card-detials > :nth-child(3)').should(
      'contain',
      `${activeRxRefills.data.attributes.refillRemaining} refills left`,
    );
  };

  verifyInformationBaseOnStatusSubmitted = () => {
    cy.get('[data-testid="submitted-refill-request"]')
      .should('be.visible')
      .and(
        'have.text',
        'We got your request on October 4, 2023. Check back for updates.',
      );
  };

  verifyNonVAPrescriptionNameOnListPage = () => {
    cy.get(
      `#card-header-${
        nonVARx.data.id
      } > [data-testid="medications-history-details-link"]`,
    ).should('contain', `${nonVARx.data.attributes.prescriptionName}`);
  };
}
export default MedicationsListPage;
