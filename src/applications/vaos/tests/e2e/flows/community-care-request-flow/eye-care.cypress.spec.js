import AppointmentListPage from '../../page-objects/AppointmentList/AppointmentListPage';
import ClosestCityPageObject from '../../page-objects/ClosestCityPageObject';
import CommunityCarePreferencesPageObject from '../../page-objects/CommunityCarePreferencesPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import EyeCarePageObject from '../../page-objects/EyeCarePageObject';
import FacilityTypePage from '../../page-objects/FacilityTypePage';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
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

describe('VAOS community care flow using VAOS services', () => {
  describe('When one facility supports CC online scheduling', () => {
    describe('And veteran has a home address', () => {
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
        mockLoginApi({ withoutAddress: true });
        mockPreferencesApi();
        mockSchedulingConfigurationApi({ facilityIds: [], isRequest: true });
        mockCCEligibilityApi({ typeOfCare: 'Optometry' });
      });

      it('should submit form', () => {
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare('Eye care')
          .clickNextButton();

        EyeCarePageObject.assertUrl()
          .selectTypeOfCare(/Optometry/)
          .clickNextButton();

        FacilityTypePage.assertUrl()
          .selectFacility(/Community care facility/i)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        CommunityCarePreferencesPageObject.assertUrl()
          .expandAccordian()
          .selectProvider()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
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

  describe('When more than one facility supports CC online scheduling', () => {
    describe('And veteran does not have a home address', () => {
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
        mockCCEligibilityApi({ typeOfCare: 'Optometry' });
      });

      it('should submit form', () => {
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

        FacilityTypePage.assertUrl()
          .selectFacility(/Community care facility/i)
          .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ClosestCityPageObject.assertUrl()
          .selectFacility()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
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
