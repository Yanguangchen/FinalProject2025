import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import ArrowBack from '../UI/arrow-back';

describe('ArrowBack (web)', () => {
  it('fires onPress when clicked', () => {
    const onPress = jest.fn();
    renderWithProviders(<ArrowBack onPress={onPress} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});


