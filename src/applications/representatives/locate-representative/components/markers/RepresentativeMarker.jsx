import PropTypes from 'prop-types';
import React from 'react';
import DivMarker from './DivMarker';

function RepresentativeMarker({ position, onClick, markerText }) {
  return (
    <DivMarker position={position} onClick={onClick}>
      <span className="i-pin-card-map">{markerText}</span>
    </DivMarker>
  );
}

RepresentativeMarker.propTypes = {
  position: PropTypes.array,
  markerText: PropTypes.string,
};

export default RepresentativeMarker;
