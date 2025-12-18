import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import ConnectionBanner from '../UI/connection-banner';

// Mock useNetwork to drive isConnected state
jest.mock('../context/NetworkContext', () => {
  return {
    useNetwork: () => ({ isConnected: false }),
  };
});

describe('ConnectionBanner (web)', () => {
  it('renders banner when offline', () => {
    render(<ConnectionBanner />);
    expect(screen.getByText(/Signal Lost/i)).toBeInTheDocument();
  });
});


