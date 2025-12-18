import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import ButtonShort from '../UI/button-short';

describe('ButtonShort (web)', () => {
  it('renders with role=button and responds to click', () => {
    const onPress = jest.fn();
    renderWithProviders(<ButtonShort title="Click Me" onPress={onPress} />);
    const btn = screen.getByRole('button', { name: /Click Me/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});


