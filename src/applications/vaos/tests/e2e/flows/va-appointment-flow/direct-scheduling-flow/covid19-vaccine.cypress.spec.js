import moment from 'moment';
import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import ClinicChoicePage from '../../../page-objects/ClinicChoicePageObject';
import ContactInfoPage from '../../../page-objects/ContactInfoPageObject';
import CovidConfirmationPageObject from '../../../page-objects/CovidConfirmationPageObject';
import PlanAheadPage from '../../../page-objects/PlanAheadPageObject';
import ReceivedDoseScreenerPage from '../../../page-objects/ReceivedDoseScreenerPageObject';
import ReviewPage from '../../../page-objects/ReviewPageObject';
import SecondDosePage from '../../../page-objects/SecondDosePageObject';
import SelectDatePage from '../../../page-objects/SelectDatePageObject';
import TypeOfCarePage from '../../../page-objects/TypeOfCarePageObject';
import VAFacilityPage from '../../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockClinicApi,
  mockDirectBookingEligibilityCriteriaApi,
  mockDirectScheduleSlotsApi,
  mockFacilitiesApi,
  mockFacilityApi,
  mockFeatureToggles,
  mockLoginApi,
  mockRequestEligibilityCriteriaApi,
  vaosSetup,
} from '../../../vaos-cypress-helpers';

describe('VAOS COVID-19 vaccine appointment flow', () => {
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
    mockDirectBookingEligibilityCriteriaApi();
    mockDirectScheduleSlotsApi({ start, end }); // TODO: rename mockAppointmentSlots
    mockFacilitiesApi({ apiVersion: 1 });
    mockFacilityApi({ id: '983', apiVersion: 1 });
    mockFeatureToggles();
    mockLoginApi();
    mockRequestEligibilityCriteriaApi();
  });

  it('should submit form', () => {
    AppointmentListPage.visit()
      .validate()
      .scheduleAppointment();

    TypeOfCarePage.assertUrl()
      .selectTypeOfCare('COVID-19 vaccine')
      .clickNextButton();

    PlanAheadPage.assertUrl().clickNextButton();

    ReceivedDoseScreenerPage.assertUrl()
      .selectNo()
      .clickNextButton();

    // Choose VA Flat Facility
    VAFacilityPage.assertUrl('/choose-facility')
      .selectFacility()
      .clickNextButton();

    // Choose Clinic
    ClinicChoicePage.assertUrl('/choose-clinic')
      .selectClinic()
      .clickNextButton();

    // Select time slot
    SelectDatePage.assertUrl()
      .selectNextMonth()
      .selectFirstAvailableDate()
      .clickNextButton();

    // Second dose page
    SecondDosePage.assertUrl().clickNextButton();

    // Contact info
    ContactInfoPage.assertUrl().clickNextButton();

    // Review
    ReviewPage.assertUrl().clickConfirmButton();
    // Check form requestBody is as expected
    cy.wait('@v0:create:appointment').should(xhr => {
      const { body } = xhr.request;
      expect(body.clinic.siteCode).to.eq('983');
      expect(body.clinic.clinicId).to.eq('455');
      expect(body).to.have.property(
        'desiredDate',
        `${start.format('YYYY-MM-DD')}T00:00:00+00:00`,
      );
      expect(body).to.have.property('dateTime');
      expect(body).to.have.property('preferredEmail', 'veteran@gmail.com');
    });

    CovidConfirmationPageObject.assertUrl().assertPage();

    cy.axeCheckBestPractice();
  });
});
