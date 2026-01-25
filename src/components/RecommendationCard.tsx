

interface RecommendationProps {
  ram: number;
  vram: number;
  type: 'general' | 'thinking' | 'vision' | 'embedding' | 'tools' | 'cloud';
}

export function RecommendationCard({ ram, vram, type }: RecommendationProps) {
  let model = "Phi-3 Mini";
  let reason = "Low memory (< 8GB RAM)";
  let command = "ollama run phi3";

  if (type === 'thinking') {
    if (vram >= 24 || ram >= 32) {
      model = "DeepSeek R1 Distill Llama 70B";
      reason = "High specs for reasoning (Run quantized)";
      command = "ollama run deepseek-r1:70b";
    } else if (ram >= 16) {
      model = "DeepSeek R1 Distill Llama 8B";
      reason = "Good balance for reasoning";
      command = "ollama run deepseek-r1:8b";
    } else {
      model = "DeepSeek R1 Distill Qwen 1.5B";
      reason = "Efficient reasoning for low resources";
      command = "ollama run deepseek-r1:1.5b";
    }
  } else if (type === 'vision') {
    if (vram >= 12 || ram >= 16) {
      model = "Llama 3.2 11B Vision";
      reason = "Capable vision model";
      command = "ollama run llama3.2-vision";
    } else {
      model = "LLaVA / Moondream";
      reason = "Lightweight vision models";
      command = "ollama run llava";
    }
  } else if (type === 'embedding') {
    model = "Nomic Embed Text";
    reason = "Best general purpose embedding model";
    command = "ollama pull nomic-embed-text";
  } else if (type === 'tools') {
    if (ram >= 16) {
      model = "Llama 3.1 8B / Mistral";
      reason = "Reliable function calling support";
      command = "ollama run llama3.1";
    } else {
      model = "Qwen 2.5 7B";
      reason = "Good tool use in smaller package";
      command = "ollama run qwen2.5";
    }
  } else if (type === 'cloud') {
     model = "Gemini 1.5 Pro / GPT-4o";
     reason = "Offload to provider APIs for max performance";
     command = "N/A (Use API)";
  } else {
    // General
    if (vram >= 24) {
      model = "Llama 3.1 70B";
      reason = "High VRAM detected (> 24GB)";
      command = "ollama run llama3.1:70b";
    } else if (ram >= 16) {
      model = "Llama 3.1 8B";
      reason = "Sufficient RAM (> 16GB)";
      command = "ollama run llama3.1";
    } else if (ram >= 8) {
        model = "Mistral 7B / Gemma 7B";
        reason = "Moderate RAM (8-16GB)";
        command = "ollama run mistral";
    }
  }

  return (
    <div class="recommendation-card card highlight">
      <h2>Recommended Model</h2>
      <div class="model-name">{model}</div>
      <p class="reason">{reason}</p>
      <div class="command-box">
        <code>{command}</code>
      </div>
    </div>
  );
}
