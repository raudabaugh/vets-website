import moment from 'moment';
import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import ClinicChoicePageObject from '../../../page-objects/ClinicChoicePageObject';
import ConfirmationPage from '../../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../../page-objects/ContactInfoPageObject';
import PreferredDatePage from '../../../page-objects/PreferredDatePage';
import ReasonForAppointmentPage from '../../../page-objects/AppointmentReasonPageObject';
import ReviewPage from '../../../page-objects/ReviewPageObject';
import SelectDatePage from '../../../page-objects/SelectDatePageObject';
import TypeOfCarePage from '../../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockClinicApi,
  mockDirectBookingEligibilityCriteriaApi,
  mockDirectScheduleSlotsApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  mockPreferencesApi,
  mockRequestEligibilityCriteriaApi,
  mockRequestLimitsApi,
  mockVisitsApi,
  vaosSetup,
} from '../../../vaos-cypress-helpers';

// Business rule
const start = moment()
  .add(1, 'days')
  // Adding number months to account for the test clicking the 'next' button to
  // advance to the next month.
  .add(1, 'months')
  .startOf('month')
  .day(9);
const end = moment(start).add(60, 'minutes');

describe('VAOS primary care direct schedule flow', () => {
  describe('When more than one facility supports online scheduling', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentRequestsApi();
      mockAppointmentsApi({ apiVersion: 0 });
      mockDirectBookingEligibilityCriteriaApi({
        facilityIds: ['983', '984'],
        typeOfCareId: '323',
      });
      mockDirectScheduleSlotsApi({ start, end, apiVersion: 0 });
      mockFacilitiesApi({
        facilityIds: ['vha_442', 'vha_552'],
        apiVersion: 0,
      });
      mockFacilitiesApi({
        facilityIds: ['vha_442', 'vha_552'],
        apiVersion: 1,
      });
      mockFeatureToggles();
      mockLoginApi();
      mockRequestEligibilityCriteriaApi();
      mockRequestLimitsApi();
      mockPreferencesApi();
      mockVisitsApi();
    });

    describe('And one clinic supports direct scheduling', () => {
      it('should schedule primary care appointment', () => {
        mockClinicApi({ clinicId: '308', apiVersion: 0 });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Primary care')
          .clickNextButton();

        // Only when CC eligible
        // FacilityTypePage.assertUrl()
        //   .selectFacility(/VA medical center/)
        //   .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2')
          .selectVAFacility(/Cheyenne VA Medical Center/)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl('/clinics')
          .selectClinic()
          .clickNextButton();

        PreferredDatePage.assertUrl()
          .typeDate()
          .clickNextButton();

        SelectDatePage.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ReasonForAppointmentPage.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'cough' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl().clickNextButton();

        ReviewPage.assertUrl().clickNextButton('Confirm appointment');

        ConfirmationPage.assertUrl();

        cy.axeCheckBestPractice();
      });
    });

    describe.skip('And more than one clinic supports direct scheduling', () => {});
    describe.skip('And no clinic supports direct, clinic supports request scheduling', () => {});
    describe.skip('And clinic does not support direct or request scheduling, veteran not eligible, or errors', () => {});
    describe.skip('And is Cerner', () => {});
    describe.skip('And veteran has no home address', () => {});
  });
});
