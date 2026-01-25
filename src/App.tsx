import { useState, useEffect } from 'preact/hooks';
import { invoke } from '@tauri-apps/api/core';
import { HardwareDashboard } from './components/HardwareDashboard';
import { RecommendationCard } from './components/RecommendationCard';
import { OllamaStatus } from './components/OllamaStatus';
import './App.css';

interface SystemSpecs {
  cpu: string;
  ram_total_gb: number;
  os: string;
}

interface GpuSpecs {
  gpu_name: string;
  vram_gb: number;
}

function App() {
  const [sysSpecs, setSysSpecs] = useState<SystemSpecs | null>(null);
  const [gpuSpecs, setGpuSpecs] = useState<GpuSpecs | null>(null);
  const [loading, setLoading] = useState(true);

  const [manualVram, setManualVram] = useState<number | null>(null);
  const [modelType, setModelType] = useState<'general' | 'thinking' | 'vision' | 'embedding' | 'tools' | 'cloud'>('general');

  useEffect(() => {
    async function fetchData() {
      try {
        const sys: SystemSpecs = await invoke('get_system_specs');
        const gpu: GpuSpecs = await invoke('get_gpu_specs');
        setSysSpecs(sys);
        setGpuSpecs(gpu);
      } catch (error) {
        console.error('Failed to fetch specs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleVramChange = (e: any) => {
    const val = parseFloat(e.target.value);
    setManualVram(isNaN(val) ? null : val);
  };

  const effectiveVram = manualVram !== null ? manualVram : (gpuSpecs?.vram_gb || 0);

  return (
    <div class="container">
      <header>
        <h1>LLM Suggest</h1>
        <OllamaStatus />
      </header>

      {loading ? (
        <div class="loading">Detecting Hardware...</div>
      ) : (
        <main>
          {sysSpecs && gpuSpecs && (
            <>
              <HardwareDashboard
                cpu={sysSpecs.cpu}
                ram={sysSpecs.ram_total_gb}
                gpu={gpuSpecs.gpu_name}
                vram={effectiveVram}
                os={sysSpecs.os}
              />
              
              <div class="controls-row">
                <div class="card vram-override">
                   <label>
                      Manual VRAM (GB):
                      <input 
                        type="number" 
                        min="0" 
                        step="1"
                        value={manualVram !== null ? manualVram : ''} 
                        onInput={handleVramChange}
                        placeholder={gpuSpecs.vram_gb.toString()}
                      />
                   </label>
                </div>

                <div class="card type-selector">
                  <label>
                    Model Type:
                    <select 
                      value={modelType} 
                      onChange={(e: any) => setModelType(e.target.value)}
                    >
                      <option value="general">General</option>
                      <option value="thinking">Thinking (Reasoning)</option>
                      <option value="vision">Vision</option>
                      <option value="tools">Tools / Agents</option>
                      <option value="embedding">Embedding</option>
                      <option value="cloud">Cloud / API</option>
                    </select>
                  </label>
                </div>
              </div>

              <RecommendationCard
                ram={sysSpecs.ram_total_gb}
                vram={effectiveVram}
                type={modelType}
              />
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
