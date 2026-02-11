import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';
import ConnectionBanner from '../UI/connection-banner';

// Mock useNetwork to drive isConnected state
let mockIsConnected = false;
jest.mock('../context/NetworkContext', () => {
  return {
    useNetwork: () => ({ isConnected: mockIsConnected }),
  };
});

beforeEach(() => {
  mockIsConnected = false;
});

describe('ConnectionBanner (web)', () => {
  it('renders banner when offline', () => {
    render(<ConnectionBanner />);
    expect(screen.getByText(/Signal Lost: No real time alerts/i)).toBeInTheDocument();
  });

  it('shows minimize button that collapses the banner', () => {
    render(<ConnectionBanner />);
    const minimizeBtn = screen.getByLabelText(/Minimize alert/i);
    expect(minimizeBtn).toBeInTheDocument();
    fireEvent.click(minimizeBtn);
    // Full text should be gone, replaced by compact pill
    expect(screen.queryByText(/No real time alerts/i)).toBeNull();
    expect(screen.getByText(/Signal Lost/)).toBeInTheDocument();
  });

  it('expands again when the minimized indicator is tapped', () => {
    render(<ConnectionBanner />);
    fireEvent.click(screen.getByLabelText(/Minimize alert/i));
    // Now tap the minimized pill to expand
    fireEvent.click(screen.getByLabelText(/Expand connection alert/i));
    expect(screen.getByText(/Signal Lost: No real time alerts/i)).toBeInTheDocument();
  });
});


