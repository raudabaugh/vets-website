import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchControls from '../components/SearchControls';

// import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

// const mapboxGlContainer = 'mapbox-gl-container';
// const zoomMessageDivID = 'screenreader-zoom-message';

const RepresentativesMap = () => {
  // const [map, setMap] = useState(null);
  // const searchResultTitleRef = useRef(null);
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 481);
  // const [isSearching, setIsSearching] = useState(false);

  // const renderMap = mobile => (
  //   <>
  //     <div id={zoomMessageDivID} aria-live="polite" className="sr-only" />
  //     <p className="sr-only" id="map-instructions" aria-live="assertive" />
  //     <map
  //       id={mapboxGlContainer}
  //       role="application"
  //       aria-label="Find VA locations on an interactive map"
  //       aria-describedby="map-instructions"
  //       onFocus={() => speakMapInstructions()}
  //       className={mobile ? '' : 'desktop-map-container'}
  //     >
  //       {shouldRenderSearchArea() && (
  //         <SearchAreaControl
  //           isMobile={mobile}
  //           isEnabled={searchAreaButtonEnabled()}
  //           handleSearchArea={handleSearchArea}
  //           query={props.currentQuery}
  //         />
  //       )}
  //     </map>
  //   </>
  // );

  // const renderView = () => {
  //   // This block renders the desktop and mobile view. It ensures that the desktop map
  //   // gets re-loaded when resizing from mobile to desktop.

  //   return (
  //     <div className={!isMobile ? 'desktop-container' : undefined}>
  //       {props.suppressPPMS && (
  //         <Alert
  //           displayType="warning"
  //           title="Some search options aren’t working right now"
  //           description="We’re sorry. Searches for non-VA facilities such as community providers and urgent care are currently unavailable. We’re working to fix this. Please check back soon."
  //         />
  //       )}
  //       <SearchControls
  //         geolocateUser={props.geolocateUser}
  //         clearGeocodeError={props.clearGeocodeError}
  //         currentQuery={currentQuery}
  //         onChange={props.updateSearchQuery}
  //         onSubmit={handleSearch}
  //         suppressPPMS={props.suppressPPMS}
  //         suppressCCP={props.suppressCCP}
  //         suppressPharmacies={props.suppressPharmacies}
  //         clearSearchText={props.clearSearchText}
  //       />
  //       <div id="search-results-title" ref={searchResultTitleRef}>
  //         {/* {!searchError && (
  //           <SearchResultsHeader
  //             results={results}
  //             facilityType={facilityType}
  //             serviceType={serviceType}
  //             context={queryContext}
  //             specialtyMap={props.specialties}
  //             inProgress={currentQuery.inProgress}
  //             pagination={pagination}
  //           />
  //         )} */}
  //         {searchError && <p />}
  //       </div>

  //       {isMobile ? (
  //         <div className="columns small-12">
  //           <Tabs>
  //             <TabList>
  //               <Tab className="small-6 tab">View List</Tab>
  //               <Tab onClick={setMapResize} className="small-6 tab">
  //                 View Map
  //               </Tab>
  //             </TabList>
  //             <TabPanel>
  //               <div className="facility-search-results">{resultsList()}</div>
  //               {paginationWrapper()}
  //             </TabPanel>
  //             <TabPanel>
  //               {renderMap(true)}
  //               {selectedResult && (
  //                 <div className="mobile-search-result">
  //                     <SearchResult
  //                       result={selectedResult}
  //                       query={currentQuery}
  //                     />
  //                 </div>
  //               )}
  //             </TabPanel>
  //           </Tabs>
  //         </div>
  //       ) : (
  //         <>
  //           <div
  //             className="columns search-results-container vads-u-padding-left--0 medium-4 small-12"
  //             id="searchResultsContainer"
  //           >
  //             <div className="facility-search-results">{resultsList()}</div>
  //           </div>
  //           {renderMap(false)}
  //           {paginationWrapper()}
  //         </>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <>
      <div>
        <div className="title-section">
          <h1>Find a Local Representative</h1>
        </div>
        <SearchControls />
        {/* {renderView()} */}
      </div>
      {/* {otherToolsLink()} */}
    </>
  );
};

export default RepresentativesMap;
