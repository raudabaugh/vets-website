import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
// import { RepresentativeType } from '../../../constants';
import RepresentativeAddress from './RepresentativeAddress';
// import { isVADomain } from '../../../utils/helpers';
// import LocationOperationStatus from './LocationOperationStatus';

const RepresentativeInfoBlock = ({ representative }) => {
  const { name } = representative.attributes;
  const { distance } = representative;
  return (
    <div>
      {distance &&
        representative.resultItem && (
          <p>
            <span className="i-pin-card-map">{representative.markerText}</span>
            <span className="vads-u-margin-left--1">
              <strong>{distance.toFixed(1)} miles</strong>
            </span>
          </p>
        )}

      <span>
        <h3 className="vads-u-font-size--h5 no-marg-top">
          <Link to={`facility/${representative.id}`}>{name}</Link>
        </h3>
      </span>

      {/* {operatingStatus &&
        operatingStatus.code !== OperatingStatus.NORMAL && (
          <LocationOperationStatus operatingStatus={operatingStatus} />
        )} */}
      <p>
        <RepresentativeAddress representative={representative} />
      </p>
    </div>
  );
};

RepresentativeInfoBlock.propTypes = {
  representative: PropTypes.object,
};
export default RepresentativeInfoBlock;
