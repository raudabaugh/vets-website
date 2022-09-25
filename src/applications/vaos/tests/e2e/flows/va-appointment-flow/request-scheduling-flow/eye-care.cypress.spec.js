import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import ClosestCityPageObject from '../../../page-objects/ClosestCityPageObject';
import ConfirmationPageObject from '../../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../../page-objects/ContactInfoPageObject';
import EyeCarePageObject from '../../../page-objects/EyeCarePageObject';
import FacilityTypePage from '../../../page-objects/FacilityTypePage';
import PreferredLanguagePageObject from '../../../page-objects/PreferredLanguagePageObject';
import ReasonForAppointmentPageObject from '../../../page-objects/ReasonForAppointmentPageObject';
import RequestDatePageObject from '../../../page-objects/RequestDatePageObject';
import ReviewPageObject from '../../../page-objects/ReviewPageObject';
import TypeOfCarePageObject from '../../../page-objects/TypeOfCarePageObject';
import {
  mockAppointmentsApi,
  mockCCEligibilityApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  mockPreferencesApi,
  mockSchedulingConfigurationApi,
  vaosSetup,
} from '../../../vaos-cypress-helpers';

describe('VAOS request schedule flow using VAOS services', () => {
  describe('When more than one facility supports online scheduling', () => {
    describe('And no clinics supports direct schedule, but request schedule is supported', () => {
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

        FacilityTypePage.assertUrl()
          .selectFacility(/Community care facility/i)
          .clickNextButton();

        // VAFacilityPageObject.assertUrl('/va-facility-2')
        //   .selectVAFacility(/Cheyenne VA Medical Center/)
        //   .clickNextButton();

        RequestDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ClosestCityPageObject.assertUrl()
          .selectFacility()
          .clickNextButton();

        PreferredLanguagePageObject.assertUrl()
          .selectLanguage('english')
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl()
          .typeAdditionalText({
            content: 'optometry',
            label: /Please let us know any additional details/i,
          })
          .clickNextButton();

        // TypeOfVisitPageObject.assertUrl()
        //   .selectVisitType()
        //   .clickNextButton();

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
