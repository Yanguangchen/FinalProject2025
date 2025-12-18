import React from 'react';
import { screen } from '@testing-library/react';
import { render, within } from '@testing-library/react';
import SignalIndicator from '../UI/signal-indicator';

jest.mock('../context/NetworkContext', () => {
  return {
    useNetwork: () => ({ strength: 'Moderate', pingMs: 220 }),
  };
});

describe('SignalIndicator (web)', () => {
  it('shows strength and ping from network context', () => {
    render(<SignalIndicator />);
    // Scope queries to this component's container to avoid duplicates
    const pingEl = screen.getByText(/ping:\s*220ms/i);
    const card = pingEl.parentElement || document.body;
    expect(within(card).getByText(/Signal:/i)).toBeInTheDocument();
    expect(within(card).getByText(/Moderate/i)).toBeInTheDocument();
  });
});


