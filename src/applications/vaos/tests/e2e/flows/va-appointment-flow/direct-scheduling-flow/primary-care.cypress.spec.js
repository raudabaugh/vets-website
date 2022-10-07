import moment from 'moment';
import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import ClinicChoicePageObject from '../../../page-objects/ClinicChoicePageObject';
import ConfirmationPage from '../../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../../page-objects/ContactInfoPageObject';
import FacilityTypePage from '../../../page-objects/FacilityTypePage';
import PreferredDatePage from '../../../page-objects/PreferredDatePage';
import ReasonForAppointmentPage from '../../../page-objects/AppointmentReasonPageObject';
import ReviewPage from '../../../page-objects/ReviewPageObject';
import SelectDatePage from '../../../page-objects/SelectDatePageObject';
import TypeOfCarePage from '../../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../../page-objects/VAFacilityPageObject';
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

describe('VAOS direct schedule flow', () => {
  const start = moment()
    .day(6)
    .add(1, 'month')
    .startOf('month')
    .day(8);
  // const start = moment()
  // Adding number months to account for the test clicking the 'next' button to
  // advance to the next month.
  // .add(1, 'days')
  // .add(1, 'months')
  // .startOf('month')
  // .day(9);
  const end = moment(start).add(60, 'minutes');

  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestMessagesApi();
    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockCCProvidersApi();
    mockClinicApi({ facilityId: '983', apiVersion: 0 });
    mockDirectBookingEligibilityCriteriaApi();
    mockDirectScheduleSlotsApi({ start, end, apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 1 });
    mockFeatureToggles();
    mockLoginApi();
    mockPreferencesApi();
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
      .selectFacility(/VA medical center/)
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
