import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import { makePdf } from '../../util/helpers';
import {
  generatePdfScaffold,
  updatePageTitle,
} from '../../../shared/util/helpers';
import { EMPTY_FIELD, pageTitles } from '../../util/constants';

const ProgressNoteDetails = props => {
  const { record, runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      const titleDate =
        record.dateSigned !== EMPTY_FIELD ? `${record.dateSigned} - ` : '';
      updatePageTitle(
        `${titleDate}${record.name} - ${
          pageTitles.CARE_SUMMARIES_AND_NOTES_PAGE_TITLE
        }`,
      );
    },
    [record.dateSigned, record.name],
  );

  const generateCareNotesPDF = async () => {
    const title = `Care summaries and notes on ${formatDateLong(record.date)}`;
    const subject = 'VA Medical Record';
    const scaffold = generatePdfScaffold(user, title, subject);

    scaffold.details = {
      header: 'Details',
      items: [
        {
          title: 'Location',
          value: record.location,
          inline: true,
        },
        {
          title: 'Signed by',
          value: record.physician,
          inline: true,
        },
        {
          title: 'Last updated',
          value: record.dateUpdated,
          inline: true,
        },
        {
          title: 'Date signed',
          value: record.dateSigned,
          inline: true,
        },
      ],
    };
    scaffold.results = {
      header: 'Notes',
      items: [
        {
          items: [
            {
              title: '',
              value: record.summary,
              inline: false,
            },
          ],
        },
      ],
    };

    makePdf(
      'care_notes_report',
      scaffold,
      'Care Note details',
      runningUnitTest,
    );
  };

  const download = () => {
    generateCareNotesPDF();
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <h1
        className="vads-u-margin-bottom--0"
        aria-describedby="progress-note-date"
      >
        {record.name}
      </h1>

      <div className="time-header">
        <h2
          className="vads-u-font-size--base vads-u-font-family--sans"
          id="progress-note-date"
        >
          Date:{' '}
          <span
            className="vads-u-font-weight--normal"
            data-testid="header-time"
          >
            {record.dateSigned}
          </span>
        </h2>
      </div>

      <div className="no-print">
        <PrintDownload
          download={download}
          allowTxtDownloads={allowTxtDownloads}
        />
        <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
      </div>

      <div className="test-details-container max-80">
        <h2>Details</h2>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Location
        </h3>
        <p>{record.location}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Signed by
        </h3>
        <p>{record.physician}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Last updated
        </h3>
        <p>{record.dateUpdated}</p>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans">
          Date signed
        </h3>
        <p>{record.dateSigned}</p>
      </div>

      <div className="test-results-container">
        <h2>Note</h2>
        <p>{record.summary}</p>
      </div>
    </div>
  );
};

export default ProgressNoteDetails;

ProgressNoteDetails.propTypes = {
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
