import AppointmentListPage from '../../page-objects/AppointmentList/AppointmentListPage';
import ClosestCityPageObject from '../../page-objects/ClosestCityPageObject';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import EyeCarePageObject from '../../page-objects/EyeCarePageObject';
import FacilityTypePageObject from '../../page-objects/FacilityTypePageObject';
import PreferredLanguagePageObject from '../../page-objects/PreferredLanguagePageObject';
import AppointmentReasonPageObject from '../../page-objects/AppointmentReasonPageObject';
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

describe('VAOS eye care community care flow using VAOS services', () => {
  describe('When one facility where veteran is registered supports CC', () => {
    describe('And veteran does have a home address', () => {
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
        mockCCEligibilityApi({ typeOfCare: 'Optometry' });
      });

      it('C26021: should request appointment', () => {
        mockLoginApi();

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare('Eye care')
          .clickNextButton();

        EyeCarePageObject.assertUrl()
          .selectTypeOfCare(/Optometry/)
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
        mockCCEligibilityApi({ typeOfCare: 'Optometry' });
      });

      it('C26022: should request appointment', () => {
        mockLoginApi({ withoutAddress: true });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare('Eye care')
          .clickNextButton();

        EyeCarePageObject.assertUrl()
          .selectTypeOfCare(/Optometry/)
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

  describe('When more than one facility where veteran is registered supports CC', () => {
    describe('And veteran does have a home address', () => {
      beforeEach(() => {
        vaosSetup();

        mockAppointmentsApi({ apiVersion: 0 });
        mockAppointmentsApi({ apiVersion: 2 });
        mockCCProvidersApi();
        mockEligibilityApi({ isEligible: true });
        mockFacilitiesApi({ apiVersion: 2 });
        mockFeatureToggles({
          v2Requests: true,
          v2Facilities: true,
          v2DirectSchedule: true,
        });
        mockPreferencesApi();
        mockSchedulingConfigurationApi({ facilityIds: [], isRequest: true });
        mockCCEligibilityApi({ typeOfCare: 'Optometry' });
      });

      it('C26023: should request appointment', () => {
        mockLoginApi();

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare('Eye care')
          .clickNextButton();

        EyeCarePageObject.assertUrl()
          .selectTypeOfCare(/Optometry/)
          .clickNextButton();

        FacilityTypePageObject.assertUrl()
          .selectFacility(/Community care facility/i)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ClosestCityPageObject.assertUrl()
          .selectFacility()
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
      beforeEach(() => {
        vaosSetup();

        mockAppointmentsApi({ apiVersion: 0 });
        mockAppointmentsApi({ apiVersion: 2 });
        mockCCProvidersApi();
        mockEligibilityApi({ isEligible: true });
        mockFacilitiesApi({ apiVersion: 2 });
        mockFeatureToggles({
          v2Requests: true,
          v2Facilities: true,
          v2DirectSchedule: true,
        });
        mockPreferencesApi();
        mockSchedulingConfigurationApi({ facilityIds: [], isRequest: true });
        mockCCEligibilityApi({ typeOfCare: 'Optometry' });
      });

      it('C26024: should request appointment', () => {
        mockLoginApi({ withoutAddress: true });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare('Eye care')
          .clickNextButton();

        EyeCarePageObject.assertUrl()
          .selectTypeOfCare(/Optometry/)
          .clickNextButton();

        FacilityTypePageObject.assertUrl()
          .selectFacility(/Community care facility/i)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ClosestCityPageObject.assertUrl()
          .selectFacility()
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .expandAccordian()
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
