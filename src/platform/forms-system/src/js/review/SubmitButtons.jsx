// libs
import React from 'react';
import PropTypes from 'prop-types';

// forms-system constants
import { APP_TYPE_DEFAULT } from '../constants';

// submit states
import ClientError from './submit-states/ClientError';
import Default from './submit-states/Default';
import GenericError from './submit-states/GenericError';
import Pending from './submit-states/Pending';
import Submitted from './submit-states/Submitted';
import ThrottledError from './submit-states/ThrottledError';
import ValidationError from './submit-states/ValidationError';

export default function SubmitButtons(props) {
  const { onSubmit, submission, formConfig, formErrors = {} } = props;

  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  const buttonText =
    formConfig.customText?.submitButtonText || `Submit ${appType}`;

  switch (submission.status) {
    case false:
      return (
        <Default
          buttonText={buttonText}
          onSubmit={onSubmit}
          formConfig={formConfig}
        />
      );
    case submission.status === 'submitPending':
      return <Pending onSubmit={onSubmit} formConfig={formConfig} />;
    case submission.status === 'applicationSubmitted':
      return <Submitted onSubmit={onSubmit} formConfig={formConfig} />;
    case submission.status === 'clientError':
      return (
        <ClientError
          buttonText={buttonText}
          formConfig={formConfig}
          onSubmit={onSubmit}
        />
      );
    case submission.status === 'throttledError':
      return (
        <ThrottledError
          buttonText={buttonText}
          formConfig={formConfig}
          when={submission.extra}
          onSubmit={onSubmit}
        />
      );
    case submission.status === 'validationError':
      return (
        <ValidationError
          appType={appType}
          buttonText={buttonText}
          formConfig={formConfig}
          formErrors={formErrors}
          onSubmit={onSubmit}
        />
      );
    default:
      return (
        <GenericError
          appType={appType}
          formConfig={formConfig}
          onSubmit={onSubmit}
        />
      );
  }
}

SubmitButtons.propTypes = {
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      appType: PropTypes.string,
      submitButtonText: PropTypes.string,
    }),
  }),
  submission: PropTypes.object,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
};
