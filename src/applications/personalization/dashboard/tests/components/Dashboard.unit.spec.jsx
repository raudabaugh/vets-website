import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';
import Dashboard from '../../components/Dashboard';

describe('<Dashboard />', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      vaProfile: {
        hero: {
          userFullName: {
            first: 'Hector',
            middle: 'J',
            last: 'Allen',
            suffix: null,
          },
          errors: null,
        },
      },
      allPayments: {
        isLoading: false,
        payments: [],
        error: null,
      },
      allDebts: {
        isLoading: false,
        isError: false,
        copays: [],
        copaysErrors: [],
        debts: [],
        debtsErrors: [],
      },
      user: {
        login: {
          currentlyLoggedIn: true,
          hasCheckedKeepAlive: false,
        },
        profile: {
          loa: {
            current: 3,
            highest: 3,
          },
          loading: false,
          services: ['appeals-status'],
          claims: {},
        },
      },
    };
  });

  it('should render the verify your identity component for an LOA1 user', async () => {
    mockFetch();
    initialState.user.profile.loa.current = 1;
    initialState.user.profile.loa.highest = 1;
    let tree;
    await act(async () => {
      tree = renderInReduxProvider(<Dashboard />, {
        initialState,
        reducers,
      });
    });

    await waitFor(() => {
      expect(tree.getByTestId('dashboard-title')).to.exist;
      expect(tree.getByTestId('verify-identity-alert-headline')).to.exist;
    });
  });

  it('should render for an LOA3 user', async () => {
    mockFetch();
    let tree;
    await act(async () => {
      tree = renderInReduxProvider(<Dashboard />, {
        initialState,
        reducers,
      });
    });

    await waitFor(() => {
      expect(tree.getByTestId('dashboard-title')).to.exist;
      expect(tree.getByTestId('dashboard-section-claims-and-appeals')).to.exist;
      expect(tree.getByTestId('dashboard-section-health-care')).to.exist;
      expect(tree.getByTestId('dashboard-section-debts')).to.exist;
      expect(tree.getByTestId('dashboard-section-payment')).to.exist;
      expect(tree.getByTestId('dashboard-section-saved-applications')).to.exist;
      expect(tree.getByTestId('dashboard-section-education-and-training')).to
        .exist;
    });
  });

  it('should render MPI Connection Error', async () => {
    mockFetch();
    initialState.user.profile.status = 'SERVER_ERROR';
    let tree;
    await act(async () => {
      tree = renderInReduxProvider(<Dashboard />, {
        initialState,
        reducers,
      });
    });

    await waitFor(() => {
      expect(tree.getByTestId('mpi-connection-error')).to.exist;
      expect(tree.queryByTestId('dashboard-section-claims-and-appeals')).to.not
        .exist;
      expect(tree.getByTestId('dashboard-section-health-care')).to.exist;
      expect(tree.getByTestId('dashboard-section-debts')).to.exist;
      expect(tree.getByTestId('dashboard-section-payment')).to.exist;
      expect(tree.getByTestId('dashboard-section-saved-applications')).to.exist;
      expect(tree.getByTestId('dashboard-section-education-and-training')).to
        .exist;
    });
  });

  it('should render the Not In MPI Error', async () => {
    mockFetch();
    initialState.user.profile.status = 'NOT_FOUND';
    let tree;
    await act(async () => {
      tree = renderInReduxProvider(<Dashboard />, {
        initialState,
        reducers,
      });
    });

    await waitFor(() => {
      expect(tree.getByTestId('not-in-mpi')).to.exist;
      expect(tree.queryByTestId('dashboard-section-claims-and-appeals')).to.not
        .exist;
      expect(tree.getByTestId('dashboard-section-health-care')).to.exist;
      expect(tree.getByTestId('dashboard-section-debts')).to.exist;
      expect(tree.getByTestId('dashboard-section-payment')).to.exist;
      expect(tree.getByTestId('dashboard-section-saved-applications')).to.exist;
      expect(tree.getByTestId('dashboard-section-education-and-training')).to
        .exist;
    });
  });

  it("should show the loader if feature toggles aren't loaded", async () => {
    mockFetch();
    initialState.featureToggles = { loading: true };
    let tree;
    await act(async () => {
      tree = renderInReduxProvider(<Dashboard />, {
        initialState,
        reducers,
      });
    });

    await waitFor(() => {
      expect(tree.getByTestId('req-loader')).to.exist;
    });
  });
});
