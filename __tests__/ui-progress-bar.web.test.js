import React from 'react';
import { render } from '@testing-library/react';
import ProgressBar from '../UI/progress-bar';

describe('ProgressBar (web)', () => {
  it('renders without crashing at 50% progress', () => {
    const { container } = render(<ProgressBar progress={0.5} height={10} />);
    expect(container.firstChild).toBeTruthy();
  });
});


