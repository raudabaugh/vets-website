import React from 'react';
import PropTypes from 'prop-types';

import { FORMAT_READABLE } from '../constants';

export const DateSubmitted = props => (
  <>
    <p />
    <h4 className="vads-u-margin-top--0">Date you filed your claim</h4>
    <span>{props.submitDate.format(FORMAT_READABLE)}</span>
  </>
);

DateSubmitted.propTypes = {
  submitDate: PropTypes.object.isRequired,
};
