import moment from 'moment';
import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import AppointmentReasonPageObject from '../../../page-objects/AppointmentReasonPageObject';
import EyeCarePageObject from '../../../page-objects/EyeCarePageObject';
import ClinicChoicePageObject from '../../../page-objects/ClinicChoicePageObject';
import ConfirmationPageObject from '../../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../../page-objects/ContactInfoPageObject';
import PreferredDatePage from '../../../page-objects/PreferredDatePage';
import ReviewPageObject from '../../../page-objects/ReviewPageObject';
import SelectDatePageObject from '../../../page-objects/SelectDatePageObject';
import TypeOfCarePageObject from '../../../page-objects/TypeOfCarePageObject';
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

// Business rule.
const start = moment()
  // Adding number months to account for the test clicking the 'next' button to
  // advance to the next month.
  .add(1, 'days')
  .add(1, 'months')
  .startOf('month')
  .day(9);
const end = moment(start).add(60, 'minutes');

describe(`VAOS eye care direct scheudle flow`, () => {
  describe('When more than one facility supports online scheduling', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentRequestsApi();
      mockAppointmentsApi({ apiVersion: 0 });
      mockDirectBookingEligibilityCriteriaApi({
        facilityIds: ['983', '984'],
        typeOfCareId: '407',
      });
      mockDirectScheduleSlotsApi({ start, end, apiVersion: 0 });
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
      it(`C23816: should schedule eye care appointment`, () => {
        mockClinicApi({ clinicId: '308', apiVersion: 0 });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare('Eye care')
          .clickNextButton();

        EyeCarePageObject.assertUrl()
          .selectTypeOfCare(/Ophthalmology/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2')
          .selectVAFacility(/Cheyenne VA Medical Center/)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl('/clinics')
          .assertOneClinicFound()
          .selectMakeAppointment()
          .clickNextButton();

        PreferredDatePage.assertUrl()
          .typeDate()
          .clickNextButton();

        SelectDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        AppointmentReasonPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'Glaucoma' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl().clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Confirm appointment');

        ConfirmationPageObject.assertUrl({ apiVersion: 0 });

        cy.axeCheckBestPractice();
      });
    });

    describe('And more than one clinic supports direct scheduling', () => {
      it(`C23817: should schedule eye care appointment`, () => {
        mockClinicApi({ apiVersion: 0 });
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare('Eye care')
          .clickNextButton();

        EyeCarePageObject.assertUrl()
          .selectTypeOfCare(/Ophthalmology/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2')
          .selectVAFacility(/Cheyenne VA Medical Center/)
          .clickNextButton();

        ClinicChoicePageObject.assertUrl('/clinics')
          .selectClinic()
          .clickNextButton();

        PreferredDatePage.assertUrl()
          .typeDate()
          .clickNextButton();

        SelectDatePageObject.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        AppointmentReasonPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'Glaucoma' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl().clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Confirm appointment');

        ConfirmationPageObject.assertUrl({ apiVersion: 0 });

        cy.axeCheckBestPractice();
      });
    });

    describe('And no clinic supports direct, clinic supports request scheduling', () => {
      it(`C23818: should schedule eye care appointment`, () => {
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        cy.axeCheckBestPractice();
      });
    });

    describe('And clinic does not support direct or request scheduling, veteran not eligible, or errors', () => {
      it(`C23819: should not schedule eye care appointment`, () => {
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        cy.axeCheckBestPractice();
      });
    });

    describe('And veteran is Cerner user', () => {
      it('C23820: should redirect to Cerner', () => {
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        cy.axeCheckBestPractice();
      });
    });

    describe('And veteran has no home address', () => {
      // Use same clinic scenarios
      it(`should schedule eye care appointment`, () => {
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

      mockAppointmentRequestsApi();
      mockAppointmentsApi({ apiVersion: 0 });
      mockDirectBookingEligibilityCriteriaApi({
        facilityIds: ['983'],
        typeOfCareId: '407',
      });
      mockDirectScheduleSlotsApi({ start, end, apiVersion: 0 });
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

    // Use same clinic scenarios
    describe('And more than one clinic supports direct scheduling', () => {
      it('should schedule appointment', () => {
        mockClinicApi({ apiVersion: 0 });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        cy.axeCheckBestPractice();
      });
    });
    describe('And one clinic supports direct scheduling', () => {
      it('should schedule appointment', () => {
        mockClinicApi({ clinicId: '308', apiVersion: 0 });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        cy.axeCheckBestPractice();
      });
    });
    describe('And no clinics support direct scheduling, clinic supports requests', () => {
      it('should schedule appointment', () => {
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        cy.axeCheckBestPractice();
      });
    });
    describe('And no clinics support direct scheduling/requests or errors have occurred', () => {
      // TODO: Add 6 test case for each error displayed
      it('should not schedule appointment', () => {
        mockClinicApi({ clinicId: '308', apiVersion: 0 });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        cy.axeCheckBestPractice();
      });
    });
    describe('And veteran is Cerner user', () => {
      it('C23820: should redirect to Cerner', () => {
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        cy.axeCheckBestPractice();
      });
    });

    describe('And veteran has no home address', () => {
      // Use same clinic scenarios
      it(`should schedule eye care appointment`, () => {
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

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
      AppointmentListPage.visit()
        .validate()
        .scheduleAppointment();

      cy.axeCheckBestPractice();
    });
  });
});
