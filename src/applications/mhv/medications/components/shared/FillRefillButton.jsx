import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { fillPrescription } from '../../actions/prescriptions';

const FillRefillButton = rx => {
  const dispatch = useDispatch();

  const {
    cmopDivisionPhone,
    dispensedDate,
    error,
    isRefillable,
    prescriptionId,
    refillStatus,
    success,
  } = rx;

  // TODO: This is what the logic used to be before. Needs to be updated
  if (refillStatus === 'expired' || refillStatus === 'refillinprocess') {
    return null;
  }

  if (isRefillable || (dispensedDate && !isRefillable)) {
    return (
      <div className="no-print">
        {success && (
          <va-alert status="success">
            <p className="vads-u-margin-y--0">
              The fill request has been submitted successfully
            </p>
          </va-alert>
        )}
        {error && (
          <va-alert status="error">
            <p className="vads-u-margin-y--0">
              We didn’t get your refill request. Try again.
            </p>
            <p className="vads-u-margin-y--0">
              If it still doesn’t work, call your VA pharmacy
              {cmopDivisionPhone ? (
                <>
                  <span> at </span>
                  <va-telephone contact={cmopDivisionPhone} />
                  <span>
                    (<va-telephone tty contact="711" />)
                  </span>
                </>
              ) : (
                <>.</>
              )}
            </p>
          </va-alert>
        )}
        <va-button
          disabled={success}
          text={`Request ${isRefillable ? 'a refill' : 'the first fill'}`}
          onClick={() => {
            dispatch(fillPrescription(prescriptionId));
          }}
        />
      </div>
    );
  }

  return null;
};

FillRefillButton.propTypes = {
  rx: PropTypes.shape({
    cmopDivisionPhone: PropTypes.string,
    dispensedDate: PropTypes.string,
    error: PropTypes.object,
    isRefillable: PropTypes.bool,
    prescriptionId: PropTypes.number,
    refillStatus: PropTypes.string,
    success: PropTypes.bool,
  }),
};

export default FillRefillButton;
