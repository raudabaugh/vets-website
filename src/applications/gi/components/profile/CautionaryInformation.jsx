/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import CautionFlagDetails from './CautionFlagDetails';
import SchoolClosingDetails from './SchoolClosingDetails';
import LearnMoreLabel from '../LearnMoreLabel';
import { ariaLabels, complaintData } from '../../constants';

export function CautionaryInformation({ institution, showModal }) {
  const {
    complaints,
    schoolClosing,
    schoolClosingOn,
    cautionFlags,
    website,
  } = institution;

  const renderTableRow = ({
    allCampuses,
    description,
    displayEmpty,
    key,
    thisCampus,
    definition,
  }) => {
    if (!displayEmpty && !thisCampus && !allCampuses) return null;
    const bold = description === 'Total Complaints';
    return (
      <tr key={key}>
        <th className="complaintHeader" tabIndex="0">
          <strong>{description}</strong> <br />
          {definition}
        </th>
        <td tabIndex="0" className="complaintCell">
          {bold ? <strong>{thisCampus}</strong> : thisCampus}
        </td>
        <td tabIndex="0" className="complaintCell">
          {bold ? <strong>{allCampuses}</strong> : allCampuses}
        </td>
      </tr>
    );
  };

  const renderListRow = ({ description, key, value, definition }) => {
    if (value < 1) return null;
    const bold = description === 'Total Complaints';
    return (
      <div className="row " key={key}>
        <div className="small-11 columns">
          <p className="vads-u-margin--0">
            {description !== 'Other' ? (
              <va-additional-info
                trigger={
                  bold ? <strong>{description}:</strong> : `${description}:`
                }
              >
                <div>{definition}</div>
              </va-additional-info>
            ) : (
              description
            )}
          </p>
        </div>
        <div className="small-1 columns">
          <p className="number vads-u-margin--0">
            {bold ? <strong>{value}</strong> : value}
          </p>
        </div>
      </div>
    );
  };

  const renderCautionFlags = () => {
    if (!schoolClosing && cautionFlags.length === 0) {
      return null;
    }

    return (
      <div>
        <h3 tabIndex="-1" id="viewWarnings">
          Alerts from VA and other federal agencies
        </h3>
        <SchoolClosingDetails
          schoolClosing={schoolClosing}
          schoolClosingOn={schoolClosingOn}
          schoolWebsite={website}
        />
        <CautionFlagDetails cautionFlags={cautionFlags} />
        <div className="vads-u-margin-bottom--5">
          <p>
            Before enrolling in a program at this institution, VA recommends
            that potential students consider these cautionary warnings. Caution
            flags indicate that VA or other federal agencies like the Department
            of Defense (DoD) or Department of Education (ED) have applied
            increased regulatory or legal scrutiny to this program.
          </p>
          <p>
            To learn more about Caution Flags,{' '}
            <a
              href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#CF"
              target="_blank"
              rel="noopener noreferrer"
            >
              visit the About this tool page
            </a>
            .
          </p>
        </div>
      </div>
    );
  };

  const allCampusesLink = (
    <div className="small-screen-font">
      <LearnMoreLabel
        id="typeAccredited-button"
        bold
        text="All campuses"
        onClick={() => {
          showModal('allCampuses');
        }}
        ariaLabel={ariaLabels.learnMore.allCampusComplaints}
        buttonClassName="small-screen-font"
        buttonId="all-campuses-learn-more"
      />
    </div>
  );

  const complaintRows = complaintData.reduce(
    (hydratedComplaints, complaint) => {
      const totals = complaint.totals || {};
      const { type, key, totalKey } = complaint;
      const hydratedComplaint = {
        description: type,
        thisCampus: complaint.totals
          ? complaints[totals[0]]
          : complaints[`${key}ByFacCode`],
        allCampuses: complaint.totals
          ? complaints[totals[1]]
          : complaints[`${totalKey || key}ByOpeIdDoNotSum`],
        definition: complaint?.definition || '',
      };
      return [...hydratedComplaints, hydratedComplaint];
    },
    [],
  );

  const allComplaints = complaintRows.pop();

  /*
* Builtin user accessibilty to navigate the complaints
* table with the use of arrow keys on the keyboard
*
* tableCells - collects all cells within the complaint table and stores
* them as an array
*
* handleCellNavigation() - takes the arrow key that was pressed as the event
* and navigates the tableCell as defined below. This creates the illusion of
* a user going up, down, left, or right when navigating inside the table
*
* useEffect() - adds addEventListener() to listen for an arrow key being pressed
* then passes the pressed arrow as an event into handleCellNavigation()
*/

  const tableCells = Array.from(
    document.querySelectorAll('td.complaintCell, th.complaintHeader'),
  );

  const handleCellNavigation = event => {
    const currentCell = event.target;

    let index = tableCells.indexOf(currentCell);

    const columns = currentCell.parentElement.children.length; // Number of columns in the row

    if (event.key === 'ArrowUp') {
      index -= columns; // Move up one row
    } else if (event.key === 'ArrowDown') {
      index += columns; // Move down one row
    } else if (event.key === 'ArrowLeft') {
      index -= 1; // Move left one cell
    } else if (event.key === 'ArrowRight') {
      index += 1; // Move right one cell
    }

    if (index >= 0 && index < tableCells.length) {
      tableCells[index].focus(); // Set focus to the new cell
    }
  };

  useEffect(
    () => {
      const addCellNav = () => {
        tableCells.forEach(cell => {
          cell.addEventListener('keydown', handleCellNavigation);
        });
      };
      addCellNav();
    },
    [tableCells],
  );

  return (
    <div className="cautionary-information small-screen-font">
      {renderCautionFlags()}

      <div className="student-complaints">
        <h3 className="small-screen-font">Student feedback</h3>

        <div className="link-header">
          <h4 className="small-screen-font">
            {`${+complaints.mainCampusRollUp} student complaints in the last 24 months`}
          </h4>
          <span>
            &nbsp;
            <LearnMoreLabel
              onClick={() => {
                showModal('studentComplaints');
              }}
              buttonId="student-complaints"
              buttonClassName="small-screen-font"
            />
          </span>
        </div>
      </div>

      <div>
        <div className="table">
          <table className="all-complaints">
            <thead>
              <tr>
                <th className="complaintHeader" tabIndex="0" />
                <th className="complaintHeader" tabIndex="0">
                  This campus
                </th>
                <th className="complaintHeader" tabIndex="0">
                  {allCampusesLink}
                </th>
              </tr>
            </thead>
            <tbody>
              {renderTableRow({
                description: 'All student complaints',
                displayEmpty: true,
                thisCampus: allComplaints.thisCampus || 0,
                allCampuses: allComplaints.allCampuses || 0,
              })}
            </tbody>
          </table>

          {!!complaints.mainCampusRollUp && (
            <table className="complaints-by-type">
              <thead>
                <tr>
                  <th className="complaintHeader" tabIndex="0">
                    Complaints by type{' '}
                    <span>(Each complaint can have multiple types)</span>
                  </th>
                  <th className="complaintHeader" tabIndex="0">
                    This campus
                  </th>
                  <th className="complaintHeader" tabIndex="0">
                    {allCampusesLink}
                  </th>
                </tr>
              </thead>
              <tbody>
                {complaintRows.map(c => {
                  return renderTableRow({
                    key: c.description,
                    description: c.description,
                    thisCampus: c.thisCampus || 0,
                    allCampuses: c.allCampuses || 0,
                    definition: c.definition,
                  });
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="list">
          <h4 className="vads-u-margin-bottom--0 small-screen-font">
            This campus
          </h4>
          {complaintRows.every(
            complaintType => complaintType.thisCampus === null,
          ) && (
            <div className="row">
              <div className="small-11 columns">
                <p className="vads-u-margin--0">All student complaints:</p>
              </div>
              <div className="small-1 columns">
                <p className="number vads-u-margin--0">0</p>
              </div>
            </div>
          )}
          {complaintRows.map(c => {
            return renderListRow({
              key: c.description,
              description: c.description,
              value: c.thisCampus,
              definition: c.definition,
            });
          })}
          <h4 className="vads-u-margin-bottom--0">{allCampusesLink}</h4>
          {complaintRows.every(
            complaintType => complaintType.allCampuses === null,
          ) && (
            <div className="row">
              <div className="small-11 columns">
                <p className="vads-u-margin--0">All student complaints:</p>
              </div>
              <div className="small-1 columns">
                <p className="number vads-u-margin--0">0</p>
              </div>
            </div>
          )}
          {complaintRows.map(c => {
            return renderListRow({
              key: c.description,
              description: c.description,
              value: c.allCampuses,
              definition: c.definition,
            });
          })}
        </div>
      </div>
      <div className="small-screen:vads-u-text-align--right">
        <a
          href="/education/submit-school-feedback/introduction"
          target="_blank"
          rel="noopener noreferrer"
          id="submit-a-complaint"
        >
          Submit a complaint through our Feedback Tool
        </a>
      </div>
    </div>
  );
}

CautionaryInformation.propTypes = {
  institution: PropTypes.object,
  showModal: PropTypes.func,
};

export default CautionaryInformation;
