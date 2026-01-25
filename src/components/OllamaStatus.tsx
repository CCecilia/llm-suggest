import { useEffect, useState } from 'preact/hooks';

export function OllamaStatus() {
  const [status, setStatus] = useState<'checking' | 'running' | 'stopped'>('checking');

  const checkOllama = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const res = await fetch('http://localhost:11434/api/tags', { 
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        setStatus('running');
      } else {
        setStatus('stopped');
      }
    } catch (e) {
      setStatus('stopped');
    }
  };

  useEffect(() => {
    checkOllama();
    const interval = setInterval(checkOllama, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div class={`ollama-status ${status}`}>
      <span class="status-indicator"></span>
      Ollama is {status === 'running' ? 'Running' : status === 'checking' ? 'Checking...' : 'Not Detected'}
    </div>
  );
}
