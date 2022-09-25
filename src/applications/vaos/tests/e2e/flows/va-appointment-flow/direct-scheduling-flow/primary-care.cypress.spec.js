import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import ClinicChoicePageObject from '../../../page-objects/ClinicChoicePageObject';
import ConfirmationPage from '../../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../../page-objects/ContactInfoPageObject';
import FacilityTypePage from '../../../page-objects/FacilityTypePage';
import PreferredDatePage from '../../../page-objects/PreferredDatePage';
import ReasonForAppointmentPage from '../../../page-objects/ReasonForAppointmentPageObject';
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
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestMessagesApi();
    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockCCProvidersApi();
    mockClinicApi({ facilityId: '983', apiVersion: 0 });
    mockDirectBookingEligibilityCriteriaApi();
    mockDirectScheduleSlotsApi({ apiVersion: 0 });
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
