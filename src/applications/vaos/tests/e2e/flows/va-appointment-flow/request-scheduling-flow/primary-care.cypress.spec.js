import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import ConfirmationPage from '../../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../../page-objects/ContactInfoPageObject';
import FacilityTypePage from '../../../page-objects/FacilityTypePage';
import ReasonForAppointmentPage from '../../../page-objects/ReasonForAppointmentPageObject';
import ReviewPage from '../../../page-objects/ReviewPageObject';
import RequestDatePage from '../../../page-objects/RequestDatePageObject';
import TypeOfCarePage from '../../../page-objects/TypeOfCarePageObject';
import {
  mockAppointmentRequestMessagesApi,
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockCCEligibilityApi,
  mockCCProvidersApi,
  mockClinicApi,
  mockDirectBookingEligibilityCriteriaApi,
  mockDirectScheduleSlotsApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  mockPreferencesApi,
  mockRequestEligibilityCriteriaApi,
  mockRequestLimitsApi,
  mockSupportedSitesApi,
  mockVisitsApi,
  vaosSetup,
} from '../../../vaos-cypress-helpers';
import ClosestCityPage from '../../../page-objects/ClosestCityPageObject';
import PreferredLanguagePage from '../../../page-objects/PreferredLanguagePageObject';

describe('VAOS request schedule flow', () => {
  describe('community care eligible', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentRequestMessagesApi();
      mockAppointmentRequestsApi();
      mockAppointmentsApi({ apiVersion: 0 });
      mockCCProvidersApi();
      mockClinicApi({ facilityId: '983', apiVersion: 0 });
      mockDirectBookingEligibilityCriteriaApi();
      mockDirectScheduleSlotsApi({ apiVersion: 0 });
      mockFacilitiesApi({ apiVersion: 0 });
      mockFacilitiesApi({ apiVersion: 1 });
      mockFeatureToggles();
      mockLoginApi();
      mockPreferencesApi();
      mockRequestEligibilityCriteriaApi();
      mockRequestLimitsApi();
      mockSupportedSitesApi();
      mockVisitsApi();
      mockCCEligibilityApi();
    });

    it('should submit form', () => {
      AppointmentListPage.visit()
        .validate()
        .scheduleAppointment();

      TypeOfCarePage.assertUrl()
        .selectTypeOfCare('Primary care')
        .clickNextButton();

      FacilityTypePage.assertUrl()
        .selectFacility(/Community care facility/)
        .clickNextButton();

      RequestDatePage.assertUrl()
        .selectFirstAvailableDate()
        .clickNextButton();

      ClosestCityPage.assertUrl()
        .selectFacility()
        .clickNextButton();

      PreferredLanguagePage.assertUrl()
        .selectLanguage('english')
        .clickNextButton();

      ReasonForAppointmentPage.assertUrl()
        .typeAdditionalText({
          content: 'cough',
          label: /Please let us know any additional details/i,
        })
        .clickNextButton();

      ContactInfoPageObject.assertUrl()
        .selectPreferredTime()
        .clickNextButton();

      ReviewPage.assertUrl().clickNextButton('Request appointment');

      ConfirmationPage.assertUrl({ url: '/request' });

      cy.axeCheckBestPractice();
    });
  });
});
