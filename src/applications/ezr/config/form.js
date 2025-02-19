// platform imports
import environment from 'platform/utilities/environment';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';

// internal app imports
import manifest from '../manifest.json';
import content from '../locales/en/content.json';
import {
  SHARED_PATHS,
  INSURANCE_VIEW_FIELDS,
  DEPENDENT_VIEW_FIELDS,
} from '../utils/constants';
import { includeSpousalInformation } from '../utils/helpers/household';
import { prefillTransformer } from '../utils/helpers/prefill-transformer';
import { submitTransformer } from '../utils/helpers/submit-transformer';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import DowntimeWarning from '../components/FormAlerts/DowntimeWarning';
import SubmissionErrorAlert from '../components/FormAlerts/SubmissionErrorAlert';
import PreSubmitNotice from '../components/PreSubmitNotice';
import GetFormHelp from '../components/GetFormHelp';
import FormFooter from '../components/FormFooter';

// chapter 1 - Veteran Information
import VeteranProfileInformation from '../components/FormPages/VeteranProfileInformation';
import veteranDateOfBirth from './chapters/veteranInformation/dateOfBirth';
import veteranBirthSex from './chapters/veteranInformation/birthSex';
import veteranGenderIdentity from './chapters/veteranInformation/genderIdentity';
import veteranMailingAddress from './chapters/veteranInformation/mailingAddress';
import veteranHomeAddress from './chapters/veteranInformation/homeAddress';
import veteranContantInformation from './chapters/veteranInformation/contactInformation';

// chapter 2 - Household Information
import maritalStatus from './chapters/householdInformation/maritalStatus';
import spousePersonalInformation from './chapters/householdInformation/spousePersonalInformation';
import spouseAdditionalInformation from './chapters/householdInformation/spouseAdditionalInformation';
import spouseFinancialSupport from './chapters/householdInformation/spouseFinancialSupport';
import spouseContactInformation from './chapters/householdInformation/spouseContactInformation';
import dependentSummary from './chapters/householdInformation/dependentSummary';
import veteranAnnualIncome from './chapters/householdInformation/veteranAnnualIncome';
import spouseAnnualIncome from './chapters/householdInformation/spouseAnnualIncome';
import deductibleExpenses from './chapters/householdInformation/deductibleExpenses';
import DependentSummaryPage from '../components/FormPages/DependentSummary';
import DependentInformationPage from '../components/FormPages/DependentInformation';
import DependentsReviewPage from '../components/FormReview/DependentsReviewPage';

// chapter 3 - Insurance Information
import medicaidEligibility from './chapters/insuranceInformation/medicaid';
import medicarePartAEnrollment from './chapters/insuranceInformation/medicare';
import partAEffectiveDate from './chapters/insuranceInformation/partAEffectiveDate';
import insurancePolicies from './chapters/insuranceInformation/insurancePolicies';
import InsuranceSummaryPage from '../components/FormPages/InsuranceSummary';
import InsurancePolicyInformationPage from '../components/FormPages/InsurancePolicyInformation';
import InsurancePolicyReviewPage from '../components/FormReview/InsurancePolicyReviewPage';

// declare shared paths for custom form page navigation
const {
  insurance: INSURANCE_PATHS,
  dependents: DEPENDENT_PATHS,
} = SHARED_PATHS;

// declare schema definitions
const { date } = ezrSchema.definitions;

// declare form config object
const formConfig = {
  title: content['form-title'],
  subTitle: content['form-subtitle'],
  formId: VA_FORM_IDS.FORM_10_10EZR,
  version: 0,
  trackingPrefix: 'ezr-',
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/form1010_ezrs`,
  transformForSubmit: submitTransformer,
  prefillEnabled: true,
  prefillTransformer,
  saveInProgress: {
    messages: {
      inProgress: content['sip-message-in-progress'],
      expired: content['sip-message-expired'],
      saved: content['sip-message-saved'],
    },
  },
  customText: {
    appType: content['sip-text-app-type'],
    appAction: content['sip-text-app-action'],
    continueAppButtonText: content['sip-text-continue-btn-text'],
    startNewAppButtonText: content['sip-text-start-new-btn-text'],
    appSavedSuccessfullyMessage: content['sip-text-app-saved-message'],
    finishAppLaterMessage: content['sip-text-finish-later'],
    reviewPageTitle: content['sip-text-review-page-title'],
    submitButtonText: content['sip-text-submit-btn-text'],
  },
  savedFormMessages: {
    notFound: content['sip-savedform-not-found'],
    noAuth: content['sip-savedform-no-auth'],
  },
  preSubmitInfo: {
    required: true,
    field: 'privacyAgreementAccepted',
    CustomComponent: PreSubmitNotice,
  },
  submissionError: SubmissionErrorAlert,
  downtime: {
    dependencies: [externalServices.es],
    message: DowntimeWarning,
  },
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  defaultDefinitions: { date },
  chapters: {
    veteranInformation: {
      title: 'Veteran information',
      pages: {
        profileInformation: {
          path: 'veteran-information/personal-information',
          title: 'Veteran\u2019s personal information',
          CustomPage: VeteranProfileInformation,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        dateOfBirth: {
          path: 'veteran-information/date-of-birth',
          title: 'Veteran\u2019s date of birth',
          initialData: {},
          depends: formData => !formData['view:userDob'],
          uiSchema: veteranDateOfBirth.uiSchema,
          schema: veteranDateOfBirth.schema,
        },
        birthSex: {
          path: 'veteran-information/birth-sex',
          title: 'Veteran\u2019s sex assigned at birth',
          initialData: {},
          depends: formData => !formData['view:userGender'],
          uiSchema: veteranBirthSex.uiSchema,
          schema: veteranBirthSex.schema,
        },
        genderIdentity: {
          path: 'veteran-information/gender-identity',
          title: 'Veteran\u2019s gender identity',
          initialData: {},
          depends: formData => formData['view:isSigiEnabled'],
          uiSchema: veteranGenderIdentity.uiSchema,
          schema: veteranGenderIdentity.schema,
        },
        mailingAddress: {
          path: 'veteran-information/mailing-address',
          title: 'Veteran\u2019s mailing address',
          initialData: {},
          uiSchema: veteranMailingAddress.uiSchema,
          schema: veteranMailingAddress.schema,
        },
        homeAddress: {
          path: 'veteran-information/home-address',
          title: 'Veteran\u2019s home address',
          initialData: {},
          depends: formData => !formData['view:doesMailingMatchHomeAddress'],
          uiSchema: veteranHomeAddress.uiSchema,
          schema: veteranHomeAddress.schema,
        },
        contactInformation: {
          path: 'veteran-information/contact-information',
          title: 'Veteran\u2019s contact information',
          initialData: {},
          uiSchema: veteranContantInformation.uiSchema,
          schema: veteranContantInformation.schema,
        },
      },
    },
    householdInformation: {
      title: 'Household financial information',
      pages: {
        maritalStatus: {
          path: 'household-information/marital-status',
          title: 'Marital status',
          initialData: {},
          uiSchema: maritalStatus.uiSchema,
          schema: maritalStatus.schema,
        },
        spousePersonalInformation: {
          path: 'household-information/spouse-personal-information',
          title: 'Spouse\u2019s personal information',
          initialData: {},
          depends: formData => includeSpousalInformation(formData),
          uiSchema: spousePersonalInformation.uiSchema,
          schema: spousePersonalInformation.schema,
        },
        spouseAdditionalInformation: {
          path: 'household-information/spouse-additional-information',
          title: 'Spouse\u2019s additional information',
          initialData: {},
          depends: formData => includeSpousalInformation(formData),
          uiSchema: spouseAdditionalInformation.uiSchema,
          schema: spouseAdditionalInformation.schema,
        },
        spouseFinancialSupport: {
          path: 'household-information/spouse-financial-support',
          title: 'Spouse\u2019s financial support',
          depends: formData =>
            includeSpousalInformation(formData) && !formData.cohabitedLastYear,
          uiSchema: spouseFinancialSupport.uiSchema,
          schema: spouseFinancialSupport.schema,
        },
        spouseContactInformation: {
          path: 'household-information/spouse-contact-information',
          title: 'Spouse\u2019s address and phone number',
          initialData: {},
          depends: formData =>
            includeSpousalInformation(formData) && !formData.sameAddress,
          uiSchema: spouseContactInformation.uiSchema,
          schema: spouseContactInformation.schema,
        },
        dependentSummary: {
          path: DEPENDENT_PATHS.summary,
          title: 'Dependents',
          CustomPage: DependentSummaryPage,
          CustomPageReview: DependentsReviewPage,
          uiSchema: dependentSummary.uiSchema,
          schema: dependentSummary.schema,
        },
        dependentInformation: {
          path: DEPENDENT_PATHS.info,
          title: 'Dependent information',
          depends: formData => !formData[DEPENDENT_VIEW_FIELDS.skip],
          CustomPage: DependentInformationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        veteranAnnualIncome: {
          path: 'household-information/veteran-annual-income',
          title: 'Your annual income',
          initialData: {},
          uiSchema: veteranAnnualIncome.uiSchema,
          schema: veteranAnnualIncome.schema,
        },
        spouseAnnualIncome: {
          path: 'household-information/spouse-annual-income',
          title: 'Spouse\u2019s annual income',
          initialData: {},
          depends: formData => includeSpousalInformation(formData),
          uiSchema: spouseAnnualIncome.uiSchema,
          schema: spouseAnnualIncome.schema,
        },
        deductibleExpenses: {
          path: 'household-information/deductible-expenses',
          title: 'Deductible expenses',
          initialData: {},
          uiSchema: deductibleExpenses.uiSchema,
          schema: deductibleExpenses.schema,
        },
      },
    },
    insuranceInformation: {
      title: 'Insurance information',
      pages: {
        medicaidEligibility: {
          path: 'insurance-information/medicaid-eligibility',
          title: 'Medicaid eligibility',
          initialData: {},
          uiSchema: medicaidEligibility.uiSchema,
          schema: medicaidEligibility.schema,
        },
        medicarePartAEnrollment: {
          path: 'insurance-information/medicare-part-a-enrollment',
          title: 'Medicare Part A enrollment',
          initialData: {},
          uiSchema: medicarePartAEnrollment.uiSchema,
          schema: medicarePartAEnrollment.schema,
        },
        medicarePartAEffectiveDate: {
          path: 'insurance-information/medicare-part-a-effective-date',
          title: 'Medicare Part A effective date',
          initialData: {},
          depends: formData => formData.isEnrolledMedicarePartA,
          uiSchema: partAEffectiveDate.uiSchema,
          schema: partAEffectiveDate.schema,
        },
        insurancePolicies: {
          path: INSURANCE_PATHS.summary,
          title: 'Insurance policies',
          CustomPage: InsuranceSummaryPage,
          CustomPageReview: InsurancePolicyReviewPage,
          uiSchema: insurancePolicies.uiSchema,
          schema: insurancePolicies.schema,
        },
        insurancePolicyInformation: {
          path: INSURANCE_PATHS.info,
          title: 'Insurance policy information',
          depends: formData => !formData[INSURANCE_VIEW_FIELDS.skip],
          CustomPage: InsurancePolicyInformationPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
      },
    },
  },
};

export default formConfig;
