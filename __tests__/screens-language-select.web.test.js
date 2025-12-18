import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import LanguageSelect from '../screens/LanguageSelect';

describe('LanguageSelect (web)', () => {
  it('renders title, language options, and proceed button', () => {
    renderWithProviders(<LanguageSelect />);
    expect(screen.getByText(/Select your language/i)).toBeInTheDocument();
    // Spot check some languages
    expect(screen.getByRole('button', { name: /French/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /English/i })).toBeInTheDocument();
    // Select a language
    fireEvent.click(screen.getByRole('button', { name: /English/i }));
    // Proceed button present
    expect(screen.getByRole('button', { name: /PROCEED/i })).toBeInTheDocument();
  });
});


