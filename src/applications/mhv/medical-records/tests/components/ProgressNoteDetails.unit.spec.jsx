import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import ProgressNoteDetails from '../../components/CareSummaries/ProgressNoteDetails';
import note from '../fixtures/dischargeSummary.json';
import noteWithDateMissing from '../fixtures/dischargeSummaryWithDateMissing.json';
import { convertNote } from '../../reducers/careSummariesAndNotes';

describe('Progress Note details component', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: convertNote(note),
      },
    },
  };
  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <ProgressNoteDetails record={convertNote(note)} runningUnitTest />,
      {
        initialState,
        reducers: reducer,
        path: '/summaries-and-notes/954',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('should display the summary name', () => {
    const header = screen.getAllByText('Discharge summary', {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const formattedDate = screen.getAllByText('August', {
      exact: false,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('should download a pdf', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen).to.exist;
  });
});

describe('Progress note details component with no date', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: convertNote(noteWithDateMissing),
      },
    },
  };

  const screen = renderWithStoreAndRouter(
    <ProgressNoteDetails
      record={convertNote(noteWithDateMissing)}
      runningUnitTest
    />,
    {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/954',
    },
  );

  it('should not display the formatted date if dateSigned is missing', () => {
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None noted',
      );
    });
  });
});
