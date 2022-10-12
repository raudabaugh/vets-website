import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import ChooseSleepCarePage from '../../../page-objects/SleepCarePageObject';
import ConfirmationPageObject from '../../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../../page-objects/ContactInfoPageObject';
import AppointmentReasonPageObject from '../../../page-objects/AppointmentReasonPageObject';
import RequestDatePageObject from '../../../page-objects/RequestDatePageObject';
import ReviewPageObject from '../../../page-objects/ReviewPageObject';
import TypeOfCarePage from '../../../page-objects/TypeOfCarePageObject';
import TypeOfVisitPageObject from '../../../page-objects/TypeOfVisitPageObject';
import VAFacilityPageObject from '../../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentRequestMessagesApi,
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockDirectBookingEligibilityCriteriaApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  mockPreferencesApi,
  mockRequestEligibilityCriteriaApi,
  mockRequestLimitsApi,
  mockSchedulingConfigurationApi,
  mockVisitsApi,
  vaosSetup,
} from '../../../vaos-cypress-helpers';

describe('VAOS sleep care request schedule flow', () => {
  describe('When more than one facility supports online scheduling', () => {
    describe('And more than one clinics support direct schedule', () => {
      describe('And veteran selects "I need a different clinic"', () => {
        it('should schedule appointment', () => {});
      });
    });

    describe('And no clinics supports direct schedule', () => {
      beforeEach(() => {
        vaosSetup();

        mockAppointmentRequestMessagesApi();
        mockAppointmentRequestsApi();
        mockAppointmentsApi({ apiVersion: 0 });
        mockDirectBookingEligibilityCriteriaApi({
          unableToScheduleCovid: true,
        });
        mockFacilitiesApi({ apiVersion: 1 });
        mockFeatureToggles();
        mockPreferencesApi();
        mockRequestEligibilityCriteriaApi();
        mockRequestLimitsApi();
        mockVisitsApi();
      });

      it('should submit form', () => {
        mockLoginApi();

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        ChooseSleepCarePage.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2')
          .selectVAFacility(/Cheyenne VA Medical Center/)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        AppointmentReasonPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'insomnia' })
          .clickNextButton();

        TypeOfVisitPageObject.assertUrl()
          .selectVisitType()
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .selectPreferredTime()
          .clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Request appointment');

        ConfirmationPageObject.assertUrl({ url: '/requests' });

        cy.axeCheckBestPractice();
      });
    });
  });
});

describe('VAOS sleep care request schedule flow using VAOS services', () => {
  describe('When more than one facility supports online scheduling', () => {
    describe('And more than one clinics support direct schedule', () => {
      describe('And veteran selects "I need a different clinic"', () => {
        it('should schedule appointment', () => {});
      });
    });

    describe('And no clinics supports direct schedule', () => {
      beforeEach(() => {
        vaosSetup();

        mockAppointmentsApi({ apiVersion: 0 });
        mockAppointmentsApi({ apiVersion: 2 });
        mockEligibilityApi({ isEligible: true });
        mockFacilitiesApi({ apiVersion: 2 });
        mockFeatureToggles({
          v2Requests: true,
          v2Facilities: true,
          v2DirectSchedule: true,
        });
        mockPreferencesApi();
        mockSchedulingConfigurationApi({ facilityIds: [], isRequest: true });
      });

      it('should submit form', () => {
        mockLoginApi();

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        ChooseSleepCarePage.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2')
          .selectVAFacility(/Cheyenne VA Medical Center/)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        AppointmentReasonPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'insomnia' })
          .clickNextButton();

        TypeOfVisitPageObject.assertUrl()
          .selectVisitType()
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .selectPreferredTime()
          .clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Request appointment');

        ConfirmationPageObject.assertUrl({ url: '/requests' });

        cy.axeCheckBestPractice();
      });
    });
  });
});
