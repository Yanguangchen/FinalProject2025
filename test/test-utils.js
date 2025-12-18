import React from 'react';
import { render } from '@testing-library/react';
import { NavigationContainer } from '@react-navigation/native';
import { ProgressProvider } from '../context/ProgressContext';

export function renderWithProviders(ui, { routeName = 'Test', ...options } = {}) {
  const Wrapper = ({ children }) => (
    <ProgressProvider>
      <NavigationContainer>{children}</NavigationContainer>
    </ProgressProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}


