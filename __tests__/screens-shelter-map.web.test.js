import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import ShelterMapScreen from '../screens/ShelterMapScreen';
import { Platform } from 'react-native';

describe('ShelterMapScreen (web)', () => {
  beforeEach(() => {
    Platform.OS = 'web';
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-key';
    // Geolocation mock
    global.navigator.geolocation.getCurrentPosition = (success) => {
      success({ coords: { latitude: 1.3, longitude: 103.8 } });
    };
  });

  it('renders map iframe and buttons', () => {
    renderWithProviders(<ShelterMapScreen />);
    expect(screen.getByTitle(/Shelter Map/i)).toBeInTheDocument();
    const nearBtn = screen.getByRole('button', { name: /Shelter Locations near me/i });
    expect(nearBtn).toBeInTheDocument();
    fireEvent.click(nearBtn);
  });
});


