import {
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import CanceledAppointmentPage from '../../page-objects/AppointmentList/CanceledAppointmentListPage';

describe('Canceled appointment list workflow', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 1 });
    mockFeatureToggles();
    mockLoginApi();
  });

  it('should render canceled appointments list', () => {
    CanceledAppointmentPage.visit().validate();
    cy.axeCheckBestPractice();
  });

  it('should navigate to canceled appointment details', () => {
    CanceledAppointmentPage.visit().clickDetails();
    cy.axeCheckBestPractice();
  });
});
