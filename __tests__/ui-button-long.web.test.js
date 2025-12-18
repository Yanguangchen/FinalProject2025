import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import ButtonLong from '../UI/button-long';

describe('ButtonLong (web)', () => {
  it('renders and calls onPress', () => {
    const onPress = jest.fn();
    renderWithProviders(<ButtonLong title="Do it" onPress={onPress} />);
    const btn = screen.getByRole('button', { name: /Do it/i });
    fireEvent.click(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});


