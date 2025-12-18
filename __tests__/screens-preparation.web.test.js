import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import PreparationScreen from '../screens/PreparationScreen';

describe('PreparationScreen (web)', () => {
  it('renders title and list of preparation items', () => {
    renderWithProviders(<PreparationScreen />);
    expect(screen.getByText(/^PREPARATION$/i)).toBeInTheDocument();
    // Check a couple of items
    expect(screen.getByRole('button', { name: /Flood Preparation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Earthquakes/i })).toBeInTheDocument();
  });
});


