import { render, screen } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import { HardwareDashboard } from '../HardwareDashboard';

describe('HardwareDashboard', () => {
  const mockProps = {
    cpu: 'Intel Core i9',
    ram: 32,
    gpu: 'NVIDIA RTX 4090',
    vram: 24,
    os: 'Linux',
  };

  it('renders system hardware specs correctly', () => {
    render(<HardwareDashboard {...mockProps} />);

    expect(screen.getByText('System Hardware')).toBeInTheDocument();
    expect(screen.getByText('Intel Core i9')).toBeInTheDocument();
    expect(screen.getByText('32 GB')).toBeInTheDocument();
    expect(screen.getByText('NVIDIA RTX 4090')).toBeInTheDocument();
    expect(screen.getByText('24 GB')).toBeInTheDocument();
    expect(screen.getByText('Linux')).toBeInTheDocument();
  });
});
