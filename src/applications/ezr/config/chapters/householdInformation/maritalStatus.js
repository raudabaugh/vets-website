import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  descriptionUI,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import { MaritalStatusDescription } from '../../../components/FormDescriptions/MaritalStatusDescription';
import content from '../../../locales/en/content.json';

const { maritalStatus } = ezrSchema.properties;

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:pageTitle': inlineTitleUI(
      content['household-marital-status-title'],
      MaritalStatusDescription,
    ),
    maritalStatus: {
      'ui:title': content['household-marital-status-label'],
      'ui:webComponentField': VaSelectField,
    },
  },
  schema: {
    type: 'object',
    required: ['maritalStatus'],
    properties: {
      'view:pageTitle': inlineTitleSchema,
      maritalStatus,
    },
  },
};
