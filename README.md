# LLM Suggest

**LLM Suggest** is a cross-platform desktop application built with [Tauri v2](https://v2.tauri.app/), [Rust](https://www.rust-lang.org/), and [Preact](https://preactjs.com/). It automatically detects your system hardware (CPU, RAM, GPU/VRAM) and recommends the optimal local Large Language Model (LLM) to run using [Ollama](https://ollama.com/).

![Valid UI Screenshot Required Here]

## Features

- **Hardware Detection**: Automatically fetches CPU, RAM, and GPU VRAM (via `nvidia-smi` on supported systems).
- **Manual Override**: Manually adjust VRAM settings to test different configurations if detection fails.
- **Model Recommendations**: Smart suggestions for models based on system capabilities:
  - **General**: Llama 3.1 70B, 8B, or Mistral/Gemma.
  - **Thinking**: DeepSeek R1 (Distilled) models for reasoning tasks.
  - **Vision**: Llama 3.2 Vision, LLaVA, etc.
  - **Tools/Agents**: Models optimized for function calling (Qwen 2.5, Llama 3.1).
  - **Embeddings**: Nomic Embed Text.
- **Ollama Integration**: Checks if Ollama is running (`localhost:11434`) and provides copy-pasteable run commands.
- **Cross-Platform**: Builds for Linux, macOS, and Windows.

## Prerequisites

- **Rust**: [Install Rust](https://www.rust-lang.org/tools/install) (stable).
- **Node.js**: [Install Node.js](https://nodejs.org/) (v20+ recommended) and `pnpm`.
- **Ollama**: [Install Ollama](https://ollama.com/) to actually run the recommended models.

### Linux Requirements (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

### GPU Support
- **NVIDIA**: Ensure `nvidia-smi` is installed and accessible in your PATH for automatic GPU detection.

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/llm-suggest.git
   cd llm-suggest/llm-suggest
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Run in development mode**:
   ```bash
   pnpm tauri dev
   ```

## Building

To create a production build for your OS:

```bash
pnpm build
```

The output binaries will be located in `src-tauri/target/release/bundle`.

## Testing

- **Frontend Tests**: `pnpm test`
- **Backend Tests**: `cargo test` (in `src-tauri`)
- **Linting**: `pnpm lint`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
