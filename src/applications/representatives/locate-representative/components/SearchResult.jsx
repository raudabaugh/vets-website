import React from 'react';
import PropTypes from 'prop-types';
// import RepresentativeInfoBlock from './search-results-items/common/RepresentativeInfoBlock';
// import RepresentativePhoneLink from './search-results-items/common/RepresentativePhoneLink';
// import RepresentativeDirectionsLink from './search-results-items/common/RepresentativeDirectionsLink';

// const SearchResult = ({ result, query }) => (
const SearchResult = ({ result }) => (
  <div className="representative-result" id={result.id}>
    {/* <RepresentativeInfoBlock representative={result} from={'SearchResult'} query={query} />
    <RepresentativeDirectionsLink
      representative={result}
      from={'SearchResult'}
      query={query}
    />
    <RepresentativePhoneLink representative={result} from={'SearchResult'} query={query} /> */}
  </div>
);

SearchResult.propTypes = {
  result: PropTypes.object,
};

export default SearchResult;
