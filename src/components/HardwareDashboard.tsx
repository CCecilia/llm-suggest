

interface HardwareProps {
  cpu: string;
  ram: number;
  gpu: string;
  vram: number;
  os: string;
}

export function HardwareDashboard({ cpu, ram, gpu, vram, os }: HardwareProps) {
  return (
    <div class="hardware-dashboard card">
      <h2>System Hardware</h2>
      <div class="specs-grid">
        <div class="spec-item">
          <span class="label">OS</span>
          <span class="value">{os}</span>
        </div>
        <div class="spec-item">
          <span class="label">CPU</span>
          <span class="value">{cpu}</span>
        </div>
        <div class="spec-item">
          <span class="label">RAM</span>
          <span class="value">{ram} GB</span>
        </div>
        <div class="spec-item">
          <span class="label">GPU</span>
          <span class="value">{gpu}</span>
        </div>
        <div class="spec-item">
          <span class="label">VRAM</span>
          <span class="value">{vram} GB</span>
        </div>
      </div>
    </div>
  );
}
