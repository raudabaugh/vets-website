import AppointmentListPage from '../../page-objects/AppointmentList/AppointmentListPage';
import ClosestCityPageObject from '../../page-objects/ClosestCityPageObject';
import CommunityCarePreferencesPage from '../../page-objects/CommunityCarePreferencesPageObject';
import ConfirmationPageObject from '../../page-objects/ConfirmationPageObject';
import ContactInfoPageObject from '../../page-objects/ContactInfoPageObject';
import PreferredLanguagePage from '../../page-objects/PreferredLanguagePageObject';
import ReasonForAppointmentPageObject from '../../page-objects/ReasonForAppointmentPageObject';
import RequestDatePage from '../../page-objects/RequestDatePageObject';
import ReviewPageObject from '../../page-objects/ReviewPageObject';
import TypeOfCarePage from '../../page-objects/TypeOfCarePageObject';
import {
  mockAppointmentsApi,
  mockCCEligibilityApi,
  mockCCProvidersApi,
  mockFacilitiesApi,
  mockFeatureToggles,
  mockLoginApi,
  mockPreferencesApi,
  mockSchedulingConfigurationApi,
  vaosSetup,
} from '../../vaos-cypress-helpers';

describe('VAOS community care flow using VAOS services', () => {
  beforeEach(() => {
    vaosSetup();

    mockAppointmentsApi({ apiVersion: 0 });
    mockAppointmentsApi({ apiVersion: 2 });
    mockCCProvidersApi();
    mockFacilitiesApi({ apiVersion: 2 });
    mockFeatureToggles({
      v2Requests: true,
      v2Facilities: true,
      v2DirectSchedule: true,
    });
    mockPreferencesApi();
  });

  describe('When one facility supports CC online scheduling', () => {
    describe('And veteran has a home address', () => {
      it('should submit form', () => {
        mockCCEligibilityApi({ typeOfCare: 'Podiatry' });
        mockLoginApi();
        mockSchedulingConfigurationApi({
          facilityIds: ['983'],
          typeOfCareId: '411',
          isDirect: true,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare(/Podiatry/)
          .clickNextButton();

        RequestDatePage.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        CommunityCarePreferencesPage.assertUrl()
          .expandAccordian()
          .selectProvider()
          .clickNextButton();

        PreferredLanguagePage.assertUrl()
          .selectLanguage('english')
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl().clickNextButton();

        ContactInfoPageObject.assertUrl()
          .selectPreferredTime()
          .clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Request appointment');

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        // Assert page content
        // Your appointment request has been submitted step
        cy.findByText('Preferred community care provider');
        cy.findByText(/your appointment request has been submitted/i);

        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When more than one facility supports CC online scheduling', () => {
    describe('And veteran does not have a home address', () => {
      it('should submit form', () => {
        mockCCEligibilityApi({ typeOfCare: 'Podiatry' });
        mockLoginApi({ withoutAddress: true });
        mockSchedulingConfigurationApi({
          facilityIds: ['983', '984'],
          typeOfCareId: '411',
          isDirect: true,
          isRequest: true,
        });

        AppointmentListPage.visit()
          .validate()
          .scheduleAppointment();

        TypeOfCarePage.assertUrl()
          .selectTypeOfCare(/Podiatry/)
          .clickNextButton();

        RequestDatePage.assertUrl()
          .selectFirstAvailableDate()
          .clickNextButton();

        ClosestCityPageObject.assertUrl()
          .selectFacility()
          .clickNextButton();

        CommunityCarePreferencesPage.assertUrl()
          .expandAccordian()
          .selectProvider()
          .clickNextButton();

        ReasonForAppointmentPageObject.assertUrl().clickNextButton();

        ContactInfoPageObject.assertUrl()
          .selectPreferredTime()
          .clickNextButton();

        ReviewPageObject.assertUrl().clickNextButton('Request appointment');

        ConfirmationPageObject.assertUrl({ apiVersion: 2 });

        // Assert page content
        // Your appointment request has been submitted step
        cy.findByText('Preferred community care provider');
        cy.findByText(/your appointment request has been submitted/i);

        cy.axeCheckBestPractice();
      });
    });
  });

  describe('When veteran is not communtity care eligible', () => {
    it('should not submit form', () => {
      mockCCEligibilityApi({ typeOfCare: 'Podiatry', isEligible: false });
      mockLoginApi();
      mockSchedulingConfigurationApi({
        facilityIds: ['983'],
        typeOfCareId: '411',
        isDirect: false,
        isRequest: false,
      });

      AppointmentListPage.visit()
        .validate()
        .scheduleAppointment();

      TypeOfCarePage.assertUrl()
        .selectTypeOfCare(/Podiatry/)
        .clickNextButton();

      cy.get('#toc-modal')
        .shadow()
        .contains(
          /You need to call your VA facility for a Podiatry appointment/i,
        );

      // Assert page content
      cy.axeCheckBestPractice();
    });
  });
});
