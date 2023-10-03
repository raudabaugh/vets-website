import React from 'react';
import PropTypes from 'prop-types';
import { buildAddressArray } from '../../utils/representativeAddress';

const RepresentativeAddress = ({ representative }) => {
  const addressArray = buildAddressArray(representative);

  if (addressArray.length === 0) {
    return (
      <span>
        <strong>Address: </strong>
        Contact for Information
      </span>
    );
  }

  return (
    <span>
      {[].concat(...addressArray.map(e => [<br key={e} />, e])).slice(1)}
    </span>
  );
};

RepresentativeAddress.propTypes = {
  representative: PropTypes.object,
};

export default RepresentativeAddress;
