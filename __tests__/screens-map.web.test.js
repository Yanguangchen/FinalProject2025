import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import Map from '../screens/Map';

// Mock navigation to capture route transitions
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
  };
});

describe('Map screen (web)', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('renders banner and begin button', () => {
    renderWithProviders(<Map />);
    expect(screen.getByText(/Preparation Series/i)).toBeInTheDocument();
    expect(screen.getByText(/Flood Preparation/i)).toBeInTheDocument();
    expect(screen.getByText(/BEGIN!/i)).toBeInTheDocument();
  });

  it('renders level nodes and navigates on tap', () => {
    renderWithProviders(<Map />);
    // Nodes 2..5 should be visible as text (node 1 shows a star)
    ['2', '3', '4', '5'].forEach((n) => {
      expect(screen.getByText(n)).toBeInTheDocument();
    });
    // Tap node "3" -> navigate to Level3
    fireEvent.click(screen.getByText('3'));
    expect(mockNavigate).toHaveBeenCalledWith('Level3');
  });

  it('BEGIN! starts Level1', () => {
    renderWithProviders(<Map />);
    fireEvent.click(screen.getByText(/BEGIN!/i));
    expect(mockNavigate).toHaveBeenCalledWith('Level1');
  });
});


