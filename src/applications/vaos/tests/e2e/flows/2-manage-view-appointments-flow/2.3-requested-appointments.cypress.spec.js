import {
  mockAppointmentRequestMessagesApi,
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import AppointmentRequestPage from '../../page-objects/AppointmentList/RequestAppointmentListPage';

describe('Requested appointment list workflow', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 1 });
    mockAppointmentRequestsApi({ id: '8a4886886e4c8e22016e6613216d001g' });
    mockAppointmentRequestMessagesApi({
      id: '8a4886886e4c8e22016e6613216d001g',
    });
    mockFeatureToggles();
    mockLoginApi();
  });

  it('should render requested appointments list', () => {
    AppointmentRequestPage.visit().validate();
    cy.axeCheckBestPractice();
  });

  it('should navigate to requested appointment details', () => {
    AppointmentRequestPage.visit().selectListItem();
    cy.axeCheckBestPractice();
  });
});
