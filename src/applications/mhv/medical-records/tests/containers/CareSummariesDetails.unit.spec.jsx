import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import user from '../fixtures/user.json';
import { convertNote } from '../../reducers/careSummariesAndNotes';
import physicianProcedureNote from '../fixtures/physicianProcedureNote.json';
import dischargeSummary from '../fixtures/dischargeSummary.json';
import CareSummariesDetails from '../../containers/CareSummariesDetails';

describe('CareSummariesAndNotes details', () => {
  const initialState = {
    user,
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: convertNote(physicianProcedureNote),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });
});

describe('CareSummariesDetails physician procedure note', () => {
  it('displays physician procedure note label', () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {
          careSummariesAndNotesDetails: convertNote(physicianProcedureNote),
        },
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
    });

    expect(screen.getByText('Physician procedure note')).to.exist;
  });
});

describe('CareSummariesDetails discharge summary', () => {
  it('displays discharge summary label', () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {
          careSummariesAndNotesDetails: convertNote(dischargeSummary),
        },
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
    });

    expect(
      screen.getByText('Discharge summary', {
        exact: true,
        selector: 'h1',
      }),
    ).to.exist;
  });
});

describe('CareSummariesDetails loading', () => {
  it('displays a loading indicator', () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {},
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('CareSummariesDetails with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        careSummariesAndNotes: {},
        alerts: {
          alertList: [
            {
              datestamp: '2023-10-10T16:03:28.568Z',
              isActive: true,
              type: 'error',
            },
            {
              datestamp: '2023-10-10T16:03:28.572Z',
              isActive: true,
              type: 'error',
            },
          ],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesDetails />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/123',
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'We can’t access your care summaries and notes records right now',
          {
            exact: false,
          },
        ),
      ).to.exist;
    });
  });
});
