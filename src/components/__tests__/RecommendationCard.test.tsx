import { render, screen } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import { RecommendationCard } from '../RecommendationCard';

describe('RecommendationCard', () => {
  it('recommends Phi-3 Mini for low specs', () => {
    render(<RecommendationCard ram={4} vram={0} type="general" />);
    expect(screen.getByText('Phi-3 Mini')).toBeInTheDocument();
  });

  it('recommends Llama 3.1 8B for moderate RAM', () => {
    render(<RecommendationCard ram={16} vram={4} type="general" />);
    expect(screen.getByText('Llama 3.1 8B')).toBeInTheDocument();
  });

  it('recommends Llama 3.1 70B for high VRAM', () => {
    render(<RecommendationCard ram={64} vram={24} type="general" />);
    expect(screen.getByText('Llama 3.1 70B')).toBeInTheDocument();
  });

  it('recommends specific model for thinking type', () => {
    render(<RecommendationCard ram={16} vram={8} type="thinking" />);
    expect(screen.getByText('DeepSeek R1 Distill Llama 8B')).toBeInTheDocument();
  });

  it('recommends vision model correctly', () => {
    render(<RecommendationCard ram={16} vram={8} type="vision" />);
    expect(screen.getByText('Llama 3.2 11B Vision')).toBeInTheDocument();
  });
  
  it('recommends embedding model correctly', () => {
    render(<RecommendationCard ram={16} vram={8} type="embedding" />);
    expect(screen.getByText('Nomic Embed Text')).toBeInTheDocument();
  });

  it('recommends tools model correctly', () => {
    render(<RecommendationCard ram={8} vram={4} type="tools" />);
    expect(screen.getByText('Qwen 2.5 7B')).toBeInTheDocument();
  });
});
