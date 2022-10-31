import AppointmentListPage from '../../page-objects/AppointmentList/AppointmentListPage';
import AppointmentReasonPageObject from '../../page-objects/AppointmentReasonPageObject';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import FacilityTypePageObject from '../../page-objects/FacilityTypePageObject';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import RequestDatePageObject from '../../page-objects/RequestDatePageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../page-objects/TypeOfCarePageObject';
import {
  mockAppointmentsApi,
  mockCCEligibilityApi,
  mockCCProvidersApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  mockPreferencesApi,
  mockSchedulingConfigurationApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

describe('VAOS nutrition community care flow using VAOS services', () => {
  describe('When one facility where veteran is registered supports CC', () => {
    describe('And veteran does have a home address', () => {
      it('C26192: should schedule appointment', () => {});
    });
    describe('And veteran does not have a home address', () => {
      it('C26193: should schedule appointment', () => {});
    });
  });

  describe('When more than one facility where veteran is registered supports CC', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentsApi({ apiVersion: 0 });
      mockAppointmentsApi({ apiVersion: 2 });
      mockCCProvidersApi();
      mockEligibilityApi({ isEligible: true });
      mockFacilitiesApi({ facilityIds: ['983'], apiVersion: 2 });
      mockFeatureToggles({
        v2Requests: true,
        v2Facilities: true,
        v2DirectSchedule: true,
      });
      mockPreferencesApi();
      mockSchedulingConfigurationApi({ facilityIds: [], isRequest: true });
      mockCCEligibilityApi({ typeOfCare: 'Nutrition' });
    });

    describe('And veteran does have a home address', () => {
      it('C26194: should schedule appointment', () => {
        mockLoginApi();

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare('Nutrition and food')
          .clickNextButton();

        FacilityTypePageObject.assertUrl()
          .selectFacility(/Community care facility/i)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .expandAccordian()
          .selectProvider()
          .clickNextButton();

        PreferredLanguagePageObject.assertUrl()
          .selectLanguage('english')
          .clickNextButton();

        AppointmentReasonPageObject.assertUrl()
          .typeAdditionalText({
            content: 'optometry',
            label: /Please let us know any additional details/i,
          })
          .clickNextButton();

        ContactInfoPageObject.assertUrl()
          .selectPreferredTime()
          .clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Request appointment');

        ConfirmationPageObject.assertUrl({ url: '/requests' });

        cy.axeCheckBestPractice();
      });
    });

    describe('And veteran does not have a home address', () => {
      it('C26195: should schedule appointment', () => {
        mockLoginApi({ withoutAddress: true });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare('Nutrition and food')
          .clickNextButton();

        FacilityTypePageObject.assertUrl()
          .selectFacility(/Community care facility/i)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .expandAccordian()
          .assertNoAddress()
          .selectProvider()
          .clickNextButton();

        AppointmentReasonPageObject.assertUrl()
          .typeAdditionalText({
            content: 'optometry',
            label: /Please let us know any additional details/i,
          })
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
