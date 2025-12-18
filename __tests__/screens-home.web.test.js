import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import HomeScreen from '../screens/HomeScreen';

describe('HomeScreen (web)', () => {
  beforeEach(() => {
    // Mock fetch for RSS so tests don't hit network
    global.fetch = jest.fn().mockResolvedValue({
      text: async () => `
        <rss><channel>
          <item>
            <title><![CDATA[Test Update Title]]></title>
            <pubDate>Mon, 01 Jan 2024 12:00:00 GMT</pubDate>
          </item>
        </channel></rss>
      `,
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders sections and cards and navigation CTAs', async () => {
    renderWithProviders(<HomeScreen />);
    expect(screen.getByText(/CURRENT STATUS/i)).toBeInTheDocument();
    expect(screen.getByText(/DASHBOARD/i)).toBeInTheDocument();
    // Cards and buttons present
    expect(screen.getByText(/Government Alerts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Elevation Map/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Shelter Map/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Preparation/i })).toBeInTheDocument();
    // Tap a nav card
    fireEvent.click(screen.getByText(/Government Alerts/i));
  });
});


