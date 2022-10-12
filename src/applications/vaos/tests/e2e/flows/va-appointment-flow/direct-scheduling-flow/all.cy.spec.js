import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import TypeOfCarePageObject from '../../../page-objects/TypeOfCarePageObject';
import {
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  vaosSetup,
} from '../../../vaos-cypress-helpers';

[
  'Amputation care',
  'Audiology and speech (including hearing aid support)',
  'COVID-19 vaccine',
  'Eye care',
  'Mental health',
  'MOVE! weight management program',
  'Pharmacy',
  'Primary care',
  'Sleep medicine',
  'Social work',
].forEach(typeOfCare => {
  describe(`VAOS ${typeOfCare} direct scheudle flow`, () => {
    describe('When more than one facility supports online scheduling', () => {
      beforeEach(() => {
        vaosSetup();
        mockAppointmentsApi({ apiVersion: 0 });
        mockAppointmentRequestsApi();
        mockFacilitiesApi({ apiVersion: 1 });
        mockFeatureToggles();
        mockLoginApi();
      });

      describe('And one clinic supports direct scheduling', () => {
        it(`should schedule ${typeOfCare} appointment`, () => {
          AppointmentListPage.visit()
            .validate()
            .scheduleAppointment();

          TypeOfCarePageObject.assertUrl()
            .selectTypeOfCare(typeOfCare)
            .clickNextButton();

          cy.axeCheckBestPractice();
        });
      });

      describe('And more than one clinic supports direct scheduling', () => {
        it(`should schedule ${typeOfCare} appointment`, () => {
          AppointmentListPage.visit()
            .validate()
            .scheduleAppointment();

          cy.axeCheckBestPractice();
        });
      });

      describe('And no clinic supports direct, clinic supports request scheduling', () => {
        it(`should schedule ${typeOfCare} appointment`, () => {
          AppointmentListPage.visit()
            .validate()
            .scheduleAppointment();

          cy.axeCheckBestPractice();
        });
      });

      describe('And clinic does not support direct or request scheduling, veteran not eligible, or errors', () => {
        it(`should not schedule ${typeOfCare} appointment`, () => {
          AppointmentListPage.visit()
            .validate()
            .scheduleAppointment();

          cy.axeCheckBestPractice();
        });
      });

      describe('And is Cerner', () => {
        it('should redirect to Cerner', () => {
          AppointmentListPage.visit()
            .validate()
            .scheduleAppointment();

          cy.axeCheckBestPractice();
        });
      });

      describe('And veteran has no home address', () => {
        // Use same clinic scenarios
        it(`should schedule ${typeOfCare} appointment`, () => {
          AppointmentListPage.visit()
            .validate()
            .scheduleAppointment();

          cy.axeCheckBestPractice();
        });
      });
    });

    describe('When one facility supports online scheduling', () => {
      beforeEach(() => {
        vaosSetup();
        mockAppointmentsApi({ apiVersion: 0 });
        mockAppointmentRequestsApi();
        mockFacilitiesApi({ apiVersion: 1 });
        mockFeatureToggles();
        mockLoginApi();
      });

      // Use same clinic scenarios
      describe('And more than one clinic supports direct scheduling', () => {
        it('should schedule appointment', () => {
          cy.axeCheckBestPractice();
        });
      });
      describe('And one clinic supports direct scheduling', () => {
        it('should schedule appointment', () => {
          cy.axeCheckBestPractice();
        });
      });
      describe('And no clinics support direct scheduling, clinic supports requests', () => {
        it('should schedule appointment', () => {
          cy.axeCheckBestPractice();
        });
      });
      describe('And no clinics support direct scheduling/requests or errors have occurred', () => {
        // TODO: Add 6 test case for each error displayed
        it('should not schedule appointment', () => {
          cy.axeCheckBestPractice();
        });
      });
    });

    describe('When zero or one facility available and does not support online scheduling', () => {
      beforeEach(() => {
        vaosSetup();
        mockAppointmentsApi({ apiVersion: 0 });
        mockAppointmentRequestsApi();
        mockFacilitiesApi({ apiVersion: 1 });
        mockFeatureToggles();
        mockLoginApi();
      });

      // TODO: Add 5 test case for each error displayed
      it('should not schedule appointment', () => {
        cy.axeCheckBestPractice();
      });
    });
  });
});
