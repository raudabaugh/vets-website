import AppointmentListPage from '../../page-objects/AppointmentList/AppointmentListPage';
import AudiologyPageObject from '../../page-objects/AudiologyPageObject';
import ClosestCityPageObject from '../../page-objects/ClosestCityPageObject';
import CommunityCarePreferencesPage from '../../page-objects/CommunityCarePreferencesPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import FacilityTypePageObject from '../../page-objects/FacilityTypePageObject';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import AppointmentReasonPageObject from '../../page-objects/AppointmentReasonPageObject';
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

describe('VAOS audiology community care request flow', () => {
  describe('When one facility where veteran is registered supports CC', () => {
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

    describe('And veteran does have a home address', () => {
      it('C23006: should request appointment', () => {
        mockCCProvidersApi();
        mockFacilityApi({ id: 'vha_442' });
        mockLoginApi();

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare(/Audiology/i)
          .clickNextButton();

        FacilityTypePageObject.assertUrl()
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

        AppointmentReasonPageObject.assertUrl()
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

    describe('And veteran does not have a home address', () => {
      it('C23007: should request appointment', () => {
        mockCCProvidersApi();
        mockFacilityApi({ id: 'vha_442' });
        mockLoginApi({ withoutAddress: true });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare(/Audiology/i)
          .clickNextButton();

        FacilityTypePageObject.assertUrl()
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

        AppointmentReasonPageObject.assertUrl()
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

  describe('When more than one facility where veteran is registered supports CC', () => {
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

    describe('And veteran does have a home address', () => {
      it('C22814: should request appointment', () => {
        mockLoginApi();

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare(/Audiology/i)
          .clickNextButton();

        FacilityTypePageObject.assertUrl()
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

        AppointmentReasonPageObject.assertUrl()
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

    describe('And veteran does not have a home address', () => {
      it('C23005: should request appointment', () => {
        mockFacilityApi({ id: 'vha_442' });
        mockLoginApi({ withoutAddress: true });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare(/Audiology/i)
          .clickNextButton();

        FacilityTypePageObject.assertUrl()
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

        AppointmentReasonPageObject.assertUrl()
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
});
