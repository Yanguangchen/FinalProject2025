import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import OfficialUpdates from '../screens/OfficialUpdates';

describe('OfficialUpdates (web)', () => {
  it('renders header and RSS card placeholders', () => {
    renderWithProviders(<OfficialUpdates />);
    // Header may appear along with another card titled "Official Updates"
    const headers = screen.getAllByText(/OFFICIAL UPDATES/i);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    // Multiple "Official Updates" titles can exist; ensure at least one card is present
    const officialCards = screen.getAllByText(/^Official Updates$/i);
    expect(officialCards.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/SCDF Updates/i)).toBeInTheDocument();
  });
});


