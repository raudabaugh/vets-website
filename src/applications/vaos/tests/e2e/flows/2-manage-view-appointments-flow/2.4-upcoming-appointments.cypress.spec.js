import {
  mockAppointmentRequestsApi,
  mockAppointmentsApi,
  mockCancelReasonsApi,
  mockFacilitiesApi,
  mockFacilityApi,
  mockFeatureToggles,
  mockLoginApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';
import AppointmentListPage from '../../page-objects/AppointmentList/AppointmentListPage';
import VAAppointmentListPage from '../../page-objects/AppointmentList/VAAppointmentListPage';
import CCAppointmentListPage from '../../page-objects/AppointmentList/CCAppointmentListPage';
import PhoneAppointmentListPage from '../../page-objects/AppointmentList/PhoneAppointmentListPage';
import VideoAppointmentListPage from '../../page-objects/AppointmentList/VideoAppointmentListPage';
import AtlasAppointmentListPage from '../../page-objects/AppointmentList/AtlasAppointmentListPage';
import HomeAppointmentListPage from '../../page-objects/AppointmentList/HomeAppointmentListPage';

describe('Upcoming appointment list workflow', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentRequestsApi();
    mockAppointmentsApi({ apiVersion: 0 });
    mockFacilitiesApi({ apiVersion: 1 });
    mockFeatureToggles();
    mockLoginApi();
  });

  it('should render upcoming appointments list', () => {
    AppointmentListPage.visit().validate();
    cy.axeCheckBestPractice();
  });

  it('should navigate to upcoming appointment details', () => {
    mockFacilityApi({ id: 'vha_442GC', apiVersion: 1 });

    VAAppointmentListPage.visit()
      .selectListItem()
      .validate();
    cy.axeCheckBestPractice();
  });

  it('should navigate to community care appointment details', () => {
    CCAppointmentListPage.visit()
      .selectListItem()
      .validate();
    cy.axeCheckBestPractice();
  });

  it('should navigate to va phone appointment appointment details', () => {
    mockFacilityApi({ id: 'vha_442', apiVersion: 1 });

    PhoneAppointmentListPage.visit()
      .selectListItem()
      .validate();
    cy.axeCheckBestPractice();
  });

  it('should navigate to va video appointment appointment details', () => {
    mockFacilityApi({ id: 'vha_442', apiVersion: 1 });

    VideoAppointmentListPage.visit()
      .selectListItem()
      .validate();
    cy.axeCheckBestPractice();
  });

  it('should navigate to va video appointment at an ATLAS location details', () => {
    mockFacilityApi({ id: 'vha_442', apiVersion: 1 });

    AtlasAppointmentListPage.visit()
      .selectListItem()
      .validate();
    cy.axeCheckBestPractice();
  });

  it('should navigate to va video appointment at home appointment details', () => {
    mockFacilityApi({ id: 'vha_442', apiVersion: 1 });

    HomeAppointmentListPage.visit()
      .selectListItem()
      .validate();
    cy.axeCheckBestPractice();
  });

  it('should allow for canceling of appointments', () => {
    mockFacilityApi({ id: 'vha_442GC', apiVersion: 1 });
    mockCancelReasonsApi({ facilityId: '983' });

    VAAppointmentListPage.visit()
      .selectListItem()
      .cancelAppointment();
    cy.axeCheckBestPractice();
  });
});
