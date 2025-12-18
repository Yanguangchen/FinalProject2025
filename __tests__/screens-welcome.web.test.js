import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import WelcomeScreen from '../screens/WelcomeScreen';

describe('WelcomeScreen (web)', () => {
  it('shows disclaimer modal and the Understood action', () => {
    renderWithProviders(<WelcomeScreen />);
    // Modal text appears
    expect(screen.getByText(/SUPPLEMENTARY TOOL/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /Understood/i });
    expect(btn).toBeInTheDocument();
  });

  it('renders brand and Get Started button', () => {
    renderWithProviders(<WelcomeScreen />);
    expect(screen.getByRole('heading', { name: /RALLY/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /GET STARTED/i })).toBeInTheDocument();
  });
});


