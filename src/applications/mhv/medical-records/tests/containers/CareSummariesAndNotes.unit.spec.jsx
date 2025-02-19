import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/dom';
import CareSummariesAndNotes from '../../containers/CareSummariesAndNotes';
import reducer from '../../reducers';
import { convertNote } from '../../reducers/careSummariesAndNotes';
import notes from '../fixtures/notes.json';
import user from '../fixtures/user.json';

describe('CareSummariesAndNotes list container', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesList: notes.entry.map(note => convertNote(note)),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
    });
  });

  it('renders without errors', () => {
    expect(
      screen.getByText('Most care summaries and notes are available', {
        exact: false,
      }),
    ).to.exist;
  });
});

describe('CareSummariesAndNotes list container still loading', () => {
  it('shows a loading indicator', () => {
    const initialState = {
      mr: {
        careSummariesAndNotes: {
          careSummariesAndNotesList: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Labs and tests list container with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        labsAndTests: {},
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

    const screen = renderWithStoreAndRouter(<CareSummariesAndNotes />, {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes',
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
