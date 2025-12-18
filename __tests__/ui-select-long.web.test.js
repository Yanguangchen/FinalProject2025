import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import SelectLong from '../UI/select-long';

describe('SelectLong (web)', () => {
  it('renders label and calls onPress', () => {
    const onPress = jest.fn();
    renderWithProviders(<SelectLong label="Option A" selected={false} onPress={onPress} />);
    const btn = screen.getByRole('button', { name: /Option A/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});


