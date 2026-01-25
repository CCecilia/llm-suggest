// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::Serialize;
use std::process::Command;
use sysinfo::System;

#[derive(Serialize)]
struct SystemSpecs {
    cpu: String,
    ram_total_gb: u64,
    os: String,
}

#[derive(Serialize, Debug, PartialEq)]
struct GpuSpecs {
    gpu_name: String,
    vram_gb: u64,
}

fn parse_nvidia_output(output: &str) -> Option<GpuSpecs> {
    let line = output.lines().next()?;
    let parts: Vec<&str> = line.split(',').collect();
    if parts.len() >= 2 {
        let name = parts[0].trim().to_string();
        let vram_mb: u64 = parts[1].trim().parse().unwrap_or(0);
        let vram_gb = vram_mb / 1024;
        Some(GpuSpecs {
            gpu_name: name,
            vram_gb,
        })
    } else {
        None
    }
}

#[tauri::command]
fn get_system_specs() -> SystemSpecs {
    // Refresh only necessary components
    let mut sys = System::new();
    // Refresh specifically usually needs explicit calls in some versions, but new_with_specifics handles initial.
    // However, refreshing twice ensures accuracy for CPU usage, though we just want model names here.
    sys.refresh_cpu_all();
    sys.refresh_memory();

    let cpu_brand = sys.cpus().first().map(|cpu| cpu.brand().to_string()).unwrap_or_else(|| "Unknown CPU".to_string());
    let ram_gb = sys.total_memory() / 1024 / 1024 / 1024; // Bytes -> GB
    let os_name = System::name().unwrap_or_else(|| "Unknown OS".to_string());
    let os_version = System::os_version().unwrap_or_else(|| "".to_string());

    SystemSpecs {
        cpu: cpu_brand,
        ram_total_gb: ram_gb,
        os: format!("{} {}", os_name, os_version).trim().to_string(),
    }
}

#[tauri::command]
fn get_gpu_specs() -> GpuSpecs {
    // Strategy 1: nvidia-smi
    let nvidia_output = Command::new("nvidia-smi")
        .args(["--query-gpu=name,memory.total", "--format=csv,noheader,nounits"])
        .output();

    if let Ok(output) = nvidia_output {
        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            if let Some(specs) = parse_nvidia_output(&stdout) {
                return specs;
            }
        }
    }

    // Strategy 2: /sys/class/drm (Linux fallback, rudimentary)
    // This is complex to parse reliably for all vendors, but checking for presence of render nodes might help.
    // For now, returning unknown if nvidia-smi fails, as integrated graphics usually share RAM (handled by system specs)
    // or specific AMD tools are needed (rocm-smi).

    // Mock for development if no real GPU found (useful for agents/VMs)
    GpuSpecs {
        gpu_name: "Integrated/Unknown (or VM)".to_string(),
        vram_gb: 0,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_system_specs, get_gpu_specs])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_nvidia_output_valid() {
        let output = "NVIDIA GeForce RTX 3090, 24576\n";
        let expected = GpuSpecs {
            gpu_name: "NVIDIA GeForce RTX 3090".to_string(),
            vram_gb: 24, // 24576 / 1024
        };
        assert_eq!(parse_nvidia_output(output), Some(expected));
    }

    #[test]
    fn test_parse_nvidia_output_valid_no_newline() {
        let output = "NVIDIA GeForce RTX 4060, 8192";
        let expected = GpuSpecs {
            gpu_name: "NVIDIA GeForce RTX 4060".to_string(),
            vram_gb: 8,
        };
        assert_eq!(parse_nvidia_output(output), Some(expected));
    }

    #[test]
    fn test_parse_nvidia_output_invalid_format() {
        let output = "Invalid Format Here";
        // split(',') will return 1 part
        assert_eq!(parse_nvidia_output(output), None);
    }

    #[test]
    fn test_parse_nvidia_output_empty() {
        let output = "";
        assert_eq!(parse_nvidia_output(output), None);
    }

    #[test]
    fn test_parse_nvidia_output_bad_number() {
        // If number parsing fails, it defaults to 0 in current implementation
        let output = "Gpu Name, NotANumber";
        let expected = GpuSpecs {
            gpu_name: "Gpu Name".to_string(),
            vram_gb: 0,
        };
        assert_eq!(parse_nvidia_output(output), Some(expected));
    }
}
