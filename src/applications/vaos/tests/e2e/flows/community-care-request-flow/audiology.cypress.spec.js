import AppointmentListPage from '../../page-objects/AppointmentList/AppointmentListPage';
import AudiologyPageObject from '../../page-objects/AudiologyPageObject';
import ClosestCityPageObject from '../../page-objects/ClosestCityPageObject';
import CommunityCarePreferencesPage from '../../page-objects/CommunityCarePreferencesPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import FacilityTypePage from '../../page-objects/FacilityTypePage';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import RequestDatePageObject from '../../page-objects/RequestDatePageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import {
  mockAppointmentRequestMessagesApi,
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockCCEligibilityApi,
  mockCCProvidersApi,
  mockFacilitiesApi,
  mockFacilityApi,
  mockFeatureToggles,
  mockLoginApi,
  mockPreferencesApi,
  mockSupportedSitesApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

describe('C21978 - VAOS community care schedule flow', () => {
  describe('When veteran is registered at more than one facility', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentRequestMessagesApi();
      mockAppointmentRequestsApi();
      mockAppointmentsApi({ apiVersion: 0 });
      mockCCProvidersApi();
      mockFacilitiesApi({ apiVersion: 0 });
      mockFacilitiesApi({ apiVersion: 1 });
      mockFeatureToggles();
      mockPreferencesApi();
      mockSupportedSitesApi({ facilityId: '983' });
      mockCCEligibilityApi({ typeOfCare: 'Audiology' });
    });

    it('C21978 - should submit form when veteran has an address', () => {
      mockLoginApi();

      AppointmentListPage.visit()
        .validate()
        .scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .selectTypeOfCare(/Audiology/i)
        .clickNextButton();

      FacilityTypePage.assertUrl()
        .selectFacility(/Community care facility/)
        .clickNextButton();

      AudiologyPageObject.assertUrl()
        .selectTypeOfCare(/Routine hearing exam/i)
        .clickNextButton();

      RequestDatePageObject.assertUrl()
        .selectFirstAvailableDate()
        .clickNextButton();

      ClosestCityPageObject.assertUrl()
        .selectFacility()
        .clickNextButton();

      CommunityCarePreferencesPage.assertUrl()
        .expandAccordian()
        .selectProvider()
        .clickNextButton();

      PreferredLanguagePageObject.assertUrl()
        .selectLanguage('english')
        .clickNextButton();

      ReasonForAppointmentPageObject.assertUrl()
        .typeAdditionalText({
          content: 'cough',
          label: /Please let us know any additional details/i,
        })
        .clickNextButton();

      ContactInfoPageObject.assertUrl()
        .selectPreferredTime()
        .clickNextButton();

      ReviewPageObject.assertUrl().clickNextButton('Request appointment');

      ConfirmationPageObject.assertUrl({ url: '/request' });

      cy.axeCheckBestPractice();
    });

    it('should submit form when veteran has no address', () => {
      mockFacilityApi({ id: 'vha_442' });
      mockLoginApi({ withoutAddress: true });

      AppointmentListPage.visit()
        .validate()
        .scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .selectTypeOfCare(/Audiology/i)
        .clickNextButton();

      FacilityTypePage.assertUrl()
        .selectFacility(/Community care facility/)
        .clickNextButton();

      AudiologyPageObject.assertUrl()
        .selectTypeOfCare(/Routine hearing exam/i)
        .clickNextButton();

      RequestDatePageObject.assertUrl()
        .selectFirstAvailableDate()
        .clickNextButton();

      ClosestCityPageObject.assertUrl()
        .selectFacility()
        .clickNextButton();

      CommunityCarePreferencesPage.assertUrl()
        .expandAccordian()
        .selectProvider()
        .clickNextButton();

      ReasonForAppointmentPageObject.assertUrl()
        .typeAdditionalText({
          content: 'cough',
          label: /Please let us know any additional details/i,
        })
        .clickNextButton();

      ContactInfoPageObject.assertUrl()
        .selectPreferredTime()
        .clickNextButton();

      ReviewPageObject.assertUrl().clickNextButton('Request appointment');

      ConfirmationPageObject.assertUrl({ url: '/request' });

      cy.axeCheckBestPractice();
    });
  });

  describe('When veteran is registered at one facility', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentRequestMessagesApi();
      mockAppointmentRequestsApi();
      mockAppointmentsApi({ apiVersion: 0 });
      mockFacilitiesApi({ apiVersion: 0 });
      mockFacilitiesApi({ apiVersion: 1 });
      mockFeatureToggles();
      mockPreferencesApi();
      mockSupportedSitesApi({ facilityId: '983' });
      mockCCEligibilityApi({ typeOfCare: 'Audiology' });
    });

    it('should submit form when veteran has an address', () => {
      mockCCProvidersApi();
      mockFacilityApi({ id: 'vha_442' });
      mockLoginApi();

      AppointmentListPage.visit()
        .validate()
        .scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .selectTypeOfCare(/Audiology/i)
        .clickNextButton();

      FacilityTypePage.assertUrl()
        .selectFacility(/Community care facility/)
        .clickNextButton();

      AudiologyPageObject.assertUrl()
        .selectTypeOfCare(/Routine hearing exam/i)
        .clickNextButton();

      RequestDatePageObject.assertUrl()
        .selectFirstAvailableDate()
        .clickNextButton();

      ClosestCityPageObject.assertUrl()
        .selectFacility()
        .clickNextButton();

      CommunityCarePreferencesPage.assertUrl()
        .expandAccordian()
        .selectProvider()
        .clickNextButton();

      PreferredLanguagePageObject.assertUrl()
        .selectLanguage('english')
        .clickNextButton();

      ReasonForAppointmentPageObject.assertUrl()
        .typeAdditionalText({
          content: 'cough',
          label: /Please let us know any additional details/i,
        })
        .clickNextButton();

      ContactInfoPageObject.assertUrl()
        .selectPreferredTime()
        .clickNextButton();

      ReviewPageObject.assertUrl().clickNextButton('Request appointment');

      ConfirmationPageObject.assertUrl({ url: '/request' });

      cy.axeCheckBestPractice();
    });

    it('should submit form when veteran has no address', () => {
      mockCCProvidersApi();
      mockFacilityApi({ id: 'vha_442' });
      mockLoginApi({ withoutAddress: true });

      AppointmentListPage.visit()
        .validate()
        .scheduleAppointment();

      TypeOfCarePageObject.assertUrl()
        .selectTypeOfCare(/Audiology/i)
        .clickNextButton();

      FacilityTypePage.assertUrl()
        .selectFacility(/Community care facility/)
        .clickNextButton();

      AudiologyPageObject.assertUrl()
        .selectTypeOfCare(/Routine hearing exam/i)
        .clickNextButton();

      RequestDatePageObject.assertUrl()
        .selectFirstAvailableDate()
        .clickNextButton();

      ClosestCityPageObject.assertUrl()
        .selectFacility()
        .clickNextButton();

      CommunityCarePreferencesPage.assertUrl()
        .expandAccordian()
        .selectProvider()
        .clickNextButton();

      ReasonForAppointmentPageObject.assertUrl()
        .typeAdditionalText({
          content: 'cough',
          label: /Please let us know any additional details/i,
        })
        .clickNextButton();

      ContactInfoPageObject.assertUrl()
        .selectPreferredTime()
        .clickNextButton();

      ReviewPageObject.assertUrl().clickNextButton('Request appointment');

      ConfirmationPageObject.assertUrl({ url: '/request' });

      cy.axeCheckBestPractice();
    });
  });
});
