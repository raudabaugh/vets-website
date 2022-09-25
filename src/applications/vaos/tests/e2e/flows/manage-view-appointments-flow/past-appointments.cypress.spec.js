import {
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import PastAppointmentPage from '../../page-objects/AppointmentList/PastAppointmentListPage';

describe('Past appointment list workflow', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 1 });
    mockFeatureToggles();
    mockLoginApi();
  });

  it('should render past appointments list', () => {
    PastAppointmentPage.visit().validate();
    cy.axeCheckBestPractice();
  });

  it('should navigate to past appointment details', () => {
    PastAppointmentPage.visit()
      .clickDetails()
      .validateDetailPage();

    cy.axeCheckBestPractice();
  });

  it('should select an updated date range', () => {
    PastAppointmentPage.visit()
      .selectDateRange()
      .clickUpdateButton()
      .validate();

    cy.axeCheckBestPractice();
  });
});
