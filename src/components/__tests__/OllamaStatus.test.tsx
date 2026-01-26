import { render, screen, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OllamaStatus } from '../OllamaStatus';

describe('OllamaStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // @ts-ignore
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('shows checking status initially', () => {
    render(<OllamaStatus />);
    expect(screen.getByText('Ollama is Checking...')).toBeInTheDocument();
  });

  it('shows running status when API returns 200', async () => {
    // @ts-ignore
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(<OllamaStatus />);

    // Fast-forward time to trigger effect if needed, though checkOllama is called immediately
    // connection check might be async, so wait for it
    await waitFor(() => {
      expect(screen.getByText('Ollama is Running')).toBeInTheDocument();
    });
  });

  it('shows stopped status when API fails', async () => {
     // @ts-ignore
    (global.fetch as any).mockResolvedValue({
      ok: false,
    });

    render(<OllamaStatus />);

    await waitFor(() => {
      expect(screen.getByText('Ollama is Not Detected')).toBeInTheDocument();
    });
  });

  it('shows stopped status on fetch error', async () => {
     // @ts-ignore
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    render(<OllamaStatus />);

    await waitFor(() => {
      expect(screen.getByText('Ollama is Not Detected')).toBeInTheDocument();
    });
  });
});
