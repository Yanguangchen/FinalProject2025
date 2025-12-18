import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import StatusCard from '../UI/status-card';

describe('StatusCard (web)', () => {
  it('renders title, subtitle and children', () => {
    render(
      <StatusCard title="Title" subtitle="Sub">
        <div data-testid="child" />
      </StatusCard>
    );
    expect(screen.getByText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Sub/i)).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});


