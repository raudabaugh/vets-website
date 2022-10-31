import moment from 'moment';
import { getTypeOfCareById } from '../../../../../utils/appointment';
import { AUDIOLOGY_TYPE_OF_CARE_ID } from '../../../../../utils/constants';
import AppointmentListPage from '../../../page-objects/AppointmentList/AppointmentListPage';
import AppointmentReasonPageObject from '../../../page-objects/AppointmentReasonPageObject';
import ClinicChoicePageObject from '../../../page-objects/ClinicChoicePageObject';
import ConfirmationPageObject from '../../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../../page-objects/ContactInfoPageObject';
import FacilityTypePageObject from '../../../page-objects/FacilityTypePageObject';
import PreferredDatePage from '../../../page-objects/PreferredDatePage';
import ReviewPageObject from '../../../page-objects/ReviewPageObject';
import SelectDatePageObject from '../../../page-objects/SelectDatePageObject';
import TypeOfCarePageObject from '../../../page-objects/TypeOfCarePageObject';
import VAFacilityPageObject from '../../../page-objects/VAFacilityPageObject';
import {
  mockAppointmentsApi,
  mockCCEligibilityApi,
  mockClinicsApi,
  mockDirectScheduleSlotsApi,
  mockEligibilityApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  mockPreferencesApi,
  mockSchedulingConfigurationApi,
  vaosSetup,
} from '../../../vaos-cypress-helpers';

const start = moment()
  // Adding number months to account for the test clicking the 'next' button to
  // advance to the next month.
  .add(5, 'days')
  .add(1, 'months')
  .startOf('month')
  .day(9);
const end = moment(start).add(60, 'minutes');

describe(`VAOS audiology direct scheudle flow`, () => {
  describe('When one facility supports online scheduling', () => {
    beforeEach(() => {
      vaosSetup();

      mockCCEligibilityApi({ typeOfCare: 'Audiology', isEligible: false });
      mockAppointmentsApi({ apiVersion: 0 });
      mockAppointmentsApi({ apiVersion: 2 });
      mockClinicsApi({ clinicId: '308', locationIds: ['983'], apiVersion: 2 });
      mockDirectScheduleSlotsApi({
        start,
        end,
        clinicId: '308',
        apiVersion: 2,
      });
      mockEligibilityApi({
        typeOfCare: AUDIOLOGY_TYPE_OF_CARE_ID,
        isEligible: true,
      });
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
      it('C30174: should schedule appointment', () => {
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: getTypeOfCareById(AUDIOLOGY_TYPE_OF_CARE_ID)?.idV2,
          isDirect: true,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare(/Audiology/i)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2')
          .assertOneFacilityFound()
          .clickNextButton();

        ClinicChoicePageObject.assertUrl('/clinics')
          .assertOneClinicFound()
          .selectClinic()
          .clickNextButton();

        PreferredDatePage.assertUrl()
          .typeDate()
          .clickNextButton();

        SelectDatePageObject.assertUrl()
          .selectNextMonth()
          .selectFirstAvailableDate()
          .clickNextButton();

        AppointmentReasonPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'audiology' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl().clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Confirm appointment');

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        cy.axeCheckBestPractice();
      });
    });

    describe('And more than one clinic supports direct scheduling', () => {
      it.skip('C30175: should schedule appointment', () => {});
    });

    describe('C30176: And no clinic supports direct, clinic supports request scheduling', () => {
      it.skip('should schedule appointment', () => {});
    });

    describe('And clinic does not support direct or request scheduling, veteran not eligible, or errors', () => {
      it.skip('C30177: should not schedule appointment', () => {});
    });

    describe('And veteran is Cerner user', () => {
      it.skip('C30178: should schedule appointment', () => {});
    });
  });

  describe('When more than one facility supports online scheduling', () => {
    beforeEach(() => {
      vaosSetup();

      mockAppointmentsApi({ apiVersion: 0 });
      mockAppointmentsApi({ apiVersion: 2 });
      mockCCEligibilityApi({ typeOfCare: 'Audiology' });
      mockClinicsApi({ clinicId: '308', locationIds: ['983'], apiVersion: 2 }); // NOTE: clinic id must match past appointments clinic id
      mockDirectScheduleSlotsApi({
        start,
        end,
        clinicId: '308',
        apiVersion: 2,
      });
      mockEligibilityApi({ typeOfCare: 'Audiology', isEligible: true });
      mockFacilitiesApi({ apiVersion: 2 });
      mockFeatureToggles({
        v2Requests: true,
        v2Facilities: true,
        v2DirectSchedule: true,
      });
      mockLoginApi();
      mockPreferencesApi();
    });

    describe('And one clinic supports direct scheduling', () => {
      it('C30174: should schedule appointment', () => {
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: getTypeOfCareById(AUDIOLOGY_TYPE_OF_CARE_ID)?.idV2,
          isDirect: true,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePageObject.assertUrl()
          .selectTypeOfCare(/Audiology/i)
          .clickNextButton();

        FacilityTypePageObject.assertUrl()
          .selectFacility(/VA medical/)
          .clickNextButton();

        VAFacilityPageObject.assertUrl('/va-facility-2').clickNextButton();

        ClinicChoicePageObject.assertUrl('/clinics')
          .assertOneClinicFound()
          .selectClinic()
          .clickNextButton();

        PreferredDatePage.assertUrl()
          .typeDate()
          .clickNextButton();

        SelectDatePageObject.assertUrl()
          .selectNextMonth()
          .selectFirstAvailableDate()
          .clickNextButton();

        AppointmentReasonPageObject.assertUrl()
          .selectReasonForAppointment()
          .typeAdditionalText({ content: 'audiology' })
          .clickNextButton();

        ContactInfoPageObject.assertUrl().clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Confirm appointment');

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        cy.axeCheckBestPractice();
      });
    });

    describe('And more than one clinic supports direct scheduling', () => {
      it.skip('C30175: should schedule appointment', () => {});
    });

    describe('And no clinic supports direct, clinic supports request scheduling', () => {
      it.skip('C30176: should schedule appointment', () => {});
    });

    describe('And clinic does not support direct or request scheduling, veteran not eligible, or errors', () => {
      it.skip('C30177: should not schedule appointment', () => {});
    });

    describe('And veteran is Cerner user', () => {
      it.skip('C30178: should schedule appointment', () => {});
    });

    describe('And veteran has no home address', () => {
      it.skip('should schedule appointment', () => {});
    });
  });
});
