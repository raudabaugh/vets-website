import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';

const fullName = {
  first: 'Joe',
  middle: '',
  last: 'Applicant',
};
const storeBase = {
  form: {
    formId: formConfig.formId,
    submission: {
      response: {
        confirmationNumber: '123456',
      },
      timestamp: Date.now(),
    },
    data: {
      applicantFullName: fullName,
    },
  },
};
const fullNameString = fullName.middle
  ? `${fullName.first} ${fullName.middle} ${fullName.last}`
  : `${fullName.first} ${fullName.last}`;
const fullNameStringRegex = new RegExp(fullNameString, 'i');

describe('Confirmation page', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('it should show status success and the correct name of applicant', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(fullNameStringRegex);
  });
});
