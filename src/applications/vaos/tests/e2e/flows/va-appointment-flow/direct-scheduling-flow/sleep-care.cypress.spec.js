import moment from 'moment';
import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import CernerPageObject from '../../../page-objects/CernerPageObject';
import SleepCarePageObject from '../../../page-objects/SleepCarePageObject';
import ClinicChoicePage from '../../../page-objects/ClinicChoicePageObject';
import ConfirmationPageObject from '../../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../../page-objects/ContactInfoPageObject';
import PreferredDatePage from '../../../page-objects/PreferredDatePage';
import AppointmentReasonPageObject from '../../../page-objects/AppointmentReasonPageObject';
import RequestDatePageObject from '../../../page-objects/RequestDatePageObject';
import ReviewPageObject from '../../../page-objects/ReviewPageObject';
import SelectDatePageObject from '../../../page-objects/SelectDatePageObject';
import TypeOfCarePage from '../../../page-objects/TypeOfCarePageObject';
import TypeOfVisitPageObject from '../../../page-objects/TypeOfVisitPageObject';
import VAFacilityPageObject from '../../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockClinicApi,
  mockDirectBookingEligibilityCriteriaApi,
  mockDirectScheduleSlotsApi,
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

describe('VAOS sleep care direct scheudle flow', () => {
  const start = moment()
    // Adding number months to account for the test clicking the 'next' button to
    // advance to the next month.
    .add(1, 'days')
    .add(1, 'months')
    .startOf('month')
    .day(9);
  const end = moment(start).add(60, 'minutes');

  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockClinicApi({ facilityId: '983', apiVersion: 0 });
    mockDirectBookingEligibilityCriteriaApi({
      facilityIds: ['983'],
      typeOfCareId: '349',
    });
    mockDirectScheduleSlotsApi({ start, end, apiVersion: 0 });
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

    SleepCarePageObject.assertUrl()
      .selectTypeOfCare(/Continuous/)
      .clickNextButton();

    VAFacilityPageObject.assertUrl('/va-facility-2')
      .selectVAFacility(/Cheyenne VA Medical Center/)
      .clickNextButton();

    ClinicChoicePage.assertUrl('/clinics')
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
      .typeAdditionalText({ content: 'insomnia' })
      .clickNextButton();

    ContactInfoPageObject.assertUrl().clickNextButton();

    ReviewPageObject.assertUrl().clickNextButton('Confirm appointment');

    ConfirmationPageObject.assertUrl();

    cy.axeCheckBestPractice();
  });
});

describe('VAOS direct scheudle flow using VAOS services', () => {
  describe('When more than one facility supports online scheduling', () => {
    const start = moment()
      // Adding number months to account for the test clicking the 'next' button to
      // advance to the next month.
      .add(5, 'days')
      .add(1, 'months')
      .startOf('month')
      .day(9);
    const end = moment(start).add(60, 'minutes');

    beforeEach(() => {
      vaosSetup();

      // mockCCEligibilityApi();
      // mockFacilityApi({ id: '983', apiVersion: 2 });
      mockAppointmentsApi({ apiVersion: 0 });
      mockAppointmentsApi({ apiVersion: 2 });
      mockClinicApi({ locations: ['983'], apiVersion: 2 });
      mockDirectScheduleSlotsApi({
        start,
        end,
        clinicId: '455',
        apiVersion: 2,
      });
      mockEligibilityApi({ typeOfCare: 'cpap', isEligible: true });
      mockFacilitiesApi({ apiVersion: 2 });
      mockFeatureToggles({
        v2Requests: true,
        v2Facilities: true,
        v2DirectSchedule: true,
      });
      mockLoginApi();
      mockPreferencesApi();
      // mockSchedulingConfigurationApi({facilityIds: ['983', '983GB'], typeOfCareId: 'cpap', isDirect: true});
    });

    describe('And one clinic supports direct scheduling', () => {
      it('C23481 - should submit form', () => {
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: 'cpap',
          isDirect: true,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2').clickNextButton();

        ClinicChoicePage.assertUrl('/clinics')
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
          .typeAdditionalText({ content: 'insomnia' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl().clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Confirm appointment');

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        cy.axeCheckBestPractice();
      });
    });

    describe('And more than one clinic supports direct scheduling', () => {
      it('C23482 - should submit form', () => {
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '983GB'],
          typeOfCareId: 'cpap',
          isDirect: true,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2')
          .selectVAFacility(/Cheyenne VA Medical Center/)
          .clickNextButton();

        ClinicChoicePage.assertUrl('/clinics')
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
          .typeAdditionalText({ content: 'insomnia' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl().clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Confirm appointment');

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        cy.axeCheckBestPractice();
      });
    });

    describe('And no clinic supports direct scheduling, clinic supports request scheduling', () => {
      it('C23483 - should submit form', () => {
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: 'cpap',
          isDirect: false,
          isRequest: true,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2').clickNextButton();

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

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        cy.axeCheckBestPractice();
      });
    });

    describe('And clinic does not support direct or request scheduling, veteran not eligible, or errors', () => {
      it('C23484 - should not submit form', () => {
        mockSchedulingConfigurationApi({
          facilityIds: [],
          typeOfCareId: 'cpap',
          isDirect: false,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2');

        // expect dialog to be displayed
        // expect back button to be enabled
        // expect next button to be disabled
        cy.get('va-alert.hydrated').contains('We could');
        cy.contains('button', 'Back').should('not.be.disabled');
        cy.contains('button', 'Continue').should('be.disabled');

        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When one facility supports online scheduling', () => {
    const start = moment()
      // Adding number months to account for the test clicking the 'next' button to
      // advance to the next month.
      .add(5, 'days')
      .add(1, 'months')
      .startOf('month')
      .day(9);
    const end = moment(start).add(60, 'minutes');

    beforeEach(() => {
      vaosSetup();

      // mockCCEligibilityApi();
      // mockFacilityApi({ id: '983', apiVersion: 2 });
      mockAppointmentsApi({ apiVersion: 0 });
      mockAppointmentsApi({ apiVersion: 2 });
      mockClinicApi({ locations: ['983'], apiVersion: 2 });
      mockDirectScheduleSlotsApi({
        start,
        end,
        clinicId: '455',
        apiVersion: 2,
      });
      mockEligibilityApi({ typeOfCare: 'cpap', isEligible: true });
      mockFacilitiesApi({ facilityIds: ['983'], apiVersion: 2 });
      mockFeatureToggles({
        v2Requests: true,
        v2Facilities: true,
        v2DirectSchedule: true,
      });
      mockLoginApi();
      mockPreferencesApi();
    });

    describe('And one clinic supports direct scheduling', () => {
      it('should submit form', () => {
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: 'cpap',
          isDirect: true,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2')
          .assertOneFacilityFound()
          .clickNextButton();

        ClinicChoicePage.assertUrl('/clinics')
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
          .typeAdditionalText({ content: 'insomnia' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl().clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Confirm appointment');

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When more than one facility supports online scheduling and no home address', () => {
    const start = moment()
      // Adding number months to account for the test clicking the 'next' button to
      // advance to the next month.
      .add(5, 'days')
      .add(1, 'months')
      .startOf('month')
      .day(9);
    const end = moment(start).add(60, 'minutes');

    beforeEach(() => {
      vaosSetup();

      // mockCCEligibilityApi();
      // mockFacilityApi({ id: '983', apiVersion: 2 });
      mockAppointmentsApi({ apiVersion: 0 });
      mockAppointmentsApi({ apiVersion: 2 });
      mockClinicApi({ locations: ['983'], apiVersion: 2 });
      mockDirectScheduleSlotsApi({
        start,
        end,
        clinicId: '455',
        apiVersion: 2,
      });
      mockEligibilityApi({ typeOfCare: 'cpap', isEligible: true });
      mockFacilitiesApi({ apiVersion: 2 });
      mockFeatureToggles({
        v2Requests: true,
        v2Facilities: true,
        v2DirectSchedule: true,
      });
      mockLoginApi({ withoutAddress: true });
      mockPreferencesApi();
    });

    describe('And more than one clinic supports direct scheduling', () => {
      it('should submit form', () => {
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '983GB'],
          typeOfCareId: 'cpap',
          isDirect: true,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2')
          .assertNoHomeAddress()
          .selectVAFacility(/Cheyenne VA Medical Center/)
          .clickNextButton();

        ClinicChoicePage.assertUrl('/clinics')
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
          .typeAdditionalText({ content: 'insomnia' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl().clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Confirm appointment');

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When more than one facility supports online scheduling and is Cerner', () => {
    beforeEach(() => {
      vaosSetup();

      // mockCCEligibilityApi();
      // mockFacilityApi({ id: '983', apiVersion: 2 });
      mockAppointmentsApi({ apiVersion: 0 });
      mockAppointmentsApi({ apiVersion: 2 });
      mockClinicApi({ locations: ['983'], apiVersion: 2 });
      mockDirectScheduleSlotsApi({ clinicId: '455', apiVersion: 2 });
      mockEligibilityApi({ typeOfCare: 'cpap', isEligible: true });
      mockFacilitiesApi({ apiVersion: 2 });
      mockFeatureToggles({
        v2Requests: true,
        v2Facilities: true,
        v2DirectSchedule: true,
      });
      mockLoginApi({ cernerFacilityId: '983' });
      mockPreferencesApi();
    });

    describe('And more than one clinic supports direct scheduling', () => {
      it('should submit form', () => {
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '983GB'],
          typeOfCareId: 'cpap',
          isDirect: true,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2')
          .assertCernerRedirect()
          .selectVAFacility(/Cheyenne VA Medical Center/)
          .clickNextButton();

        CernerPageObject.assertUrl();
        cy.contains('button', 'Back').should('not.be.disabled');
        cy.contains('button', 'Continue').should('be.disabled');

        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When zero or one facility available and does not support online scheduling', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentsApi({ apiVersion: 0 });
      mockAppointmentsApi({ apiVersion: 2 });
      mockFacilitiesApi({ apiVersion: 2 });
      mockFeatureToggles({
        v2Requests: true,
        v2Facilities: true,
        v2DirectSchedule: true,
      });
      mockLoginApi();
    });

    describe('And one facility configured, no available clinics, no requests', () => {
      it('should not submit form', () => {
        mockClinicApi({ locations: ['983'], hasClinics: false, apiVersion: 2 });
        mockEligibilityApi({ typeOfCare: 'cpap', isEligible: true });
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: 'cpap',
          isDirect: true,
          isRequest: false,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2');

        cy.get('[aria-atomic="true"] > .hydrated').contains(
          "We're sorry. This facility doesn’t have any available clinics that support online scheduling",
        );
        cy.contains('button', 'Back').should('not.be.disabled');
        cy.contains('button', 'Continue').should('be.disabled');

        cy.axeCheckBestPractice();
      });
    });

    describe('And one facility configured, no past appts, request only', () => {
      it('should not submit form', () => {
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        cy.axeCheckBestPractice();
      });
    });

    describe('And one facility configured, no past appts, direct only', () => {
      it('should not submit form', () => {
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        cy.axeCheckBestPractice();
      });
    });

    describe('And one facility configured, no past appts/limit reached', () => {
      it('should not submit form', () => {
        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        cy.axeCheckBestPractice();
      });
    });

    describe('And no sites configured for direct or request', () => {
      it('should not submit form', () => {
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: 'cpap',
          isDirect: false,
          isRequest: false,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare('Sleep medicine')
          .clickNextButton();

        SleepCarePageObject.assertUrl()
          .selectTypeOfCare(/Continuous/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2');

        cy.get('[aria-atomic="true"] > .hydrated').contains(
          'None of the facilities where you receive care accepts online appointments',
        );
        cy.contains('button', 'Back').should('not.be.disabled');
        cy.contains('button', 'Continue').should('be.disabled');

        cy.axeCheckBestPractice();
      });
    });
  });
});
