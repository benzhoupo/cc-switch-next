//! Omp (Oh My Pi) 配置文件读写模块
//!
//! 处理 `~/.omp/agent/models.yml` 配置文件的读写操作（YAML 格式）。
//! omp 使用累加式供应商管理，所有供应商配置共存于 `providers:` mapping 中。
//!
//! ## 配置结构示例
//!
//! ```yaml
//! providers:
//!   openrouter:
//!     baseUrl: https://openrouter.ai/api/v1
//!     apiKey: sk-or-xxx
//!     api: openai-completions
//!     authHeader: true
//!     models:
//!       - id: anthropic/claude-sonnet-4-6
//!         name: Claude Sonnet 4.6
//!         contextWindow: 200000
//!         maxTokens: 16384
//!         input: [text]
//! ```

use crate::config::atomic_write;
use crate::error::AppError;
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock};

// ============================================================================
// Path Functions
// ============================================================================

/// 获取 omp 配置目录
///
/// 解析顺序对齐 omp 自身的 `getOmpHome()`:
///   1. `OMP_HOME` 环境变量
///   2. 平台默认: `~/.omp`
pub fn get_omp_dir() -> PathBuf {
    if let Some(raw) = std::env::var_os("OMP_HOME") {
        let value = raw.to_string_lossy();
        let trimmed = value.trim();
        if !trimmed.is_empty() {
            return PathBuf::from(trimmed);
        }
    }

    crate::config::get_home_dir().join(".omp")
}

/// 获取 omp agent models 配置文件路径
///
/// 返回 `~/.omp/agent/models.yml`
pub fn get_omp_config_path() -> PathBuf {
    get_omp_dir().join("agent").join("models.yml")
}

fn omp_write_lock() -> &'static Mutex<()> {
    static LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    LOCK.get_or_init(|| Mutex::new(()))
}

// ============================================================================
// Type Definitions
// ============================================================================

/// omp 供应商配置（settings_config 对应的 Rust 结构）
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct OmpProviderConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(rename = "baseUrl")]
    pub base_url: String,
    #[serde(rename = "apiKey")]
    pub api_key: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub api: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub headers: Option<HashMap<String, String>>,
    #[serde(rename = "authHeader", skip_serializing_if = "Option::is_none")]
    pub auth_header: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub auth: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "disableStrictTools")]
    pub disable_strict_tools: Option<bool>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub models: Vec<OmpModelConfig>,
}

/// omp 模型配置
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct OmpModelConfig {
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(rename = "contextWindow", skip_serializing_if = "Option::is_none")]
    pub context_window: Option<u64>,
    #[serde(rename = "maxTokens", skip_serializing_if = "Option::is_none")]
    pub max_tokens: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub input: Option<Vec<String>>,
    #[serde(rename = "supportsTools", skip_serializing_if = "Option::is_none")]
    pub supports_tools: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reasoning: Option<bool>,
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

// ============================================================================
// Core YAML Read/Write
// ============================================================================

/// 读取 omp models.yml 配置
pub fn read_omp_config() -> Result<serde_yaml::Value, AppError> {
    let path = get_omp_config_path();
    if !path.exists() {
        return Ok(serde_yaml::Value::Mapping(serde_yaml::Mapping::new()));
    }

    let content = fs::read_to_string(&path).map_err(|e| AppError::io(&path, e))?;
    if content.trim().is_empty() {
        return Ok(serde_yaml::Value::Mapping(serde_yaml::Mapping::new()));
    }

    serde_yaml::from_str(&content)
        .map_err(|e| AppError::Config(format!("Failed to parse omp models.yml: {e}")))
}

/// 写入 omp models.yml 配置（带备份和原子写入）
pub fn write_omp_config(config: &serde_yaml::Value) -> Result<(), AppError> {
    let path = get_omp_config_path();

    // Create parent directories
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| AppError::io(parent, e))?;
    }

    let yaml_str = serde_yaml::to_string(config)
        .map_err(|e| AppError::Config(format!("Failed to serialize omp config: {e}")))?;

    atomic_write(&path, yaml_str.as_bytes())?;

    log::debug!("omp config written to {:?}", path);
    Ok(())
}

// ============================================================================
// Provider Functions
// ============================================================================

/// 获取所有供应商（JSON 格式，供前端使用）
pub fn get_providers() -> Result<serde_json::Map<String, serde_json::Value>, AppError> {
    let config = read_omp_config()?;
    let mut map = serde_json::Map::new();

    if let Some(providers) = config
        .get("providers")
        .and_then(|v| v.as_mapping())
    {
        for (key, value) in providers {
            if let Some(id) = key.as_str() {
                let yaml_str = serde_yaml::to_string(value).map_err(|e| {
                    AppError::Config(format!("Failed to serialize YAML value: {e}"))
                })?;
                let json_val: serde_json::Value =
                    serde_yaml::from_str(&yaml_str).map_err(|e| {
                        AppError::Config(format!("Failed to convert YAML to JSON: {e}"))
                    })?;
                map.insert(id.to_string(), json_val);
            }
        }
    }

    Ok(map)
}

/// 获取单个供应商
pub fn get_provider(name: &str) -> Result<Option<serde_json::Value>, AppError> {
    Ok(get_providers()?.get(name).cloned())
}

/// 设置（upsert）一个供应商到 providers: mapping
pub fn set_provider(
    name: &str,
    provider_config: serde_json::Value,
) -> Result<(), AppError> {
    let _guard = omp_write_lock().lock()?;

    let mut config = read_omp_config()?;

    let json_str = serde_json::to_string(&provider_config)
        .map_err(|e| AppError::Config(format!("Failed to serialize provider config: {e}")))?;
    let yaml_val: serde_yaml::Value = serde_yaml::from_str(&json_str)
        .map_err(|e| AppError::Config(format!("Failed to convert provider config to YAML: {e}")))?;

    // Get or create the providers mapping
    if config.get("providers").is_none() {
        config["providers"] = serde_yaml::Value::Mapping(serde_yaml::Mapping::new());
    }

    if let Some(providers) = config
        .get_mut("providers")
        .and_then(|v| v.as_mapping_mut())
    {
        let key = serde_yaml::Value::String(name.to_string());
        providers.insert(key, yaml_val);
    }

    write_omp_config(&config)
}

/// 删除一个供应商
pub fn remove_provider(name: &str) -> Result<(), AppError> {
    let _guard = omp_write_lock().lock()?;

    let mut config = read_omp_config()?;

    if let Some(providers) = config
        .get_mut("providers")
        .and_then(|v| v.as_mapping_mut())
    {
        let key = serde_yaml::Value::String(name.to_string());
        providers.remove(&key);
    }

    write_omp_config(&config)
}

/// 获取类型化的供应商配置
pub fn get_typed_providers() -> Result<IndexMap<String, OmpProviderConfig>, AppError> {
    let providers = get_providers()?;
    let mut result = IndexMap::new();

    for (id, value) in providers {
        match serde_json::from_value::<OmpProviderConfig>(value) {
            Ok(config) => {
                result.insert(id, config);
            }
            Err(e) => {
                log::warn!("Failed to parse omp provider '{id}': {e}");
            }
        }
    }

    Ok(result)
}

/// 设置类型化的供应商配置
pub fn set_typed_provider(id: &str, config: &OmpProviderConfig) -> Result<(), AppError> {
    let value = serde_json::to_value(config)
        .map_err(|e| AppError::Config(format!("Failed to serialize omp provider: {e}")))?;
    set_provider(id, value)
}

// ============================================================================
// MCP Functions
// ============================================================================

/// 获取 omp MCP 服务器配置（从 mcp.yml 或 models.yml 的 mcpServers 字段）
pub fn get_mcp_servers() -> Result<serde_json::Map<String, serde_json::Value>, AppError> {
    // Try mcp.yml first, then fall back to models.yml mcpServers
    let mcp_path = get_omp_dir().join("agent").join("mcp.yml");
    if mcp_path.exists() {
        let content = fs::read_to_string(&mcp_path)
            .map_err(|e| AppError::io(&mcp_path, e))?;
        if !content.trim().is_empty() {
            let yaml: serde_yaml::Value = serde_yaml::from_str(&content)
                .map_err(|e| AppError::Config(format!("Failed to parse omp mcp.yml: {e}")))?;
            let mut map = serde_json::Map::new();
            if let Some(servers) = yaml.get("mcpServers").and_then(|v| v.as_mapping()) {
                for (key, value) in servers {
                    if let Some(id) = key.as_str() {
                        let yaml_str = serde_yaml::to_string(value).map_err(|e| {
                            AppError::Config(format!("Failed to serialize YAML value: {e}"))
                        })?;
                        let json_val: serde_json::Value =
                            serde_yaml::from_str(&yaml_str).map_err(|e| {
                                AppError::Config(format!("Failed to convert YAML to JSON: {e}"))
                            })?;
                        map.insert(id.to_string(), json_val);
                    }
                }
            }
            return Ok(map);
        }
    }

    Ok(serde_json::Map::new())
}

/// 写入 omp MCP 服务器到 mcp.yml
pub fn set_mcp_server(id: &str, config: serde_json::Value) -> Result<(), AppError> {
    let mcp_path = get_omp_dir().join("agent").join("mcp.yml");
    let mut full_config = if mcp_path.exists() {
        let content = fs::read_to_string(&mcp_path)
            .map_err(|e| AppError::io(&mcp_path, e))?;
        if content.trim().is_empty() {
            serde_yaml::Value::Mapping(serde_yaml::Mapping::new())
        } else {
            serde_yaml::from_str(&content)
                .map_err(|e| AppError::Config(format!("Failed to parse omp mcp.yml: {e}")))?
        }
    } else {
        serde_yaml::Value::Mapping(serde_yaml::Mapping::new())
    };

    if full_config.get("mcpServers").is_none() {
        full_config["mcpServers"] =
            serde_yaml::Value::Mapping(serde_yaml::Mapping::new());
    }

    let json_str = serde_json::to_string(&config)
        .map_err(|e| AppError::Config(format!("Failed to serialize MCP config: {e}")))?;
    let yaml_val: serde_yaml::Value = serde_yaml::from_str(&json_str)
        .map_err(|e| AppError::Config(format!("Failed to convert MCP config to YAML: {e}")))?;

    if let Some(servers) = full_config
        .get_mut("mcpServers")
        .and_then(|v| v.as_mapping_mut())
    {
        let key = serde_yaml::Value::String(id.to_string());
        servers.insert(key, yaml_val);
    }

    if let Some(parent) = mcp_path.parent() {
        fs::create_dir_all(parent).map_err(|e| AppError::io(parent, e))?;
    }

    let yaml_str = serde_yaml::to_string(&full_config)
        .map_err(|e| AppError::Config(format!("Failed to serialize omp mcp config: {e}")))?;

    atomic_write(&mcp_path, yaml_str.as_bytes())?;
    log::debug!("omp MCP server '{}' written to {:?}", id, mcp_path);
    Ok(())
}

/// 删除 omp MCP 服务器
pub fn remove_mcp_server(id: &str) -> Result<(), AppError> {
    let mcp_path = get_omp_dir().join("agent").join("mcp.yml");
    if !mcp_path.exists() {
        return Ok(());
    }

    let content = fs::read_to_string(&mcp_path)
        .map_err(|e| AppError::io(&mcp_path, e))?;
    if content.trim().is_empty() {
        return Ok(());
    }

    let mut config: serde_yaml::Value = serde_yaml::from_str(&content)
        .map_err(|e| AppError::Config(format!("Failed to parse omp mcp.yml: {e}")))?;

    if let Some(servers) = config
        .get_mut("mcpServers")
        .and_then(|v| v.as_mapping_mut())
    {
        let key = serde_yaml::Value::String(id.to_string());
        servers.remove(&key);
    }

    let yaml_str = serde_yaml::to_string(&config)
        .map_err(|e| AppError::Config(format!("Failed to serialize omp mcp config: {e}")))?;

    atomic_write(&mcp_path, yaml_str.as_bytes())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_omp_provider_config_serialization() {
        let config = OmpProviderConfig {
            name: Some("Test Provider".to_string()),
            base_url: "https://api.test.com/v1".to_string(),
            api_key: "sk-test".to_string(),
            api: Some("openai-completions".to_string()),
            auth_header: Some(true),
            models: vec![OmpModelConfig {
                id: "test-model".to_string(),
                name: Some("Test Model".to_string()),
                context_window: Some(128000),
                max_tokens: Some(16384),
                input: Some(vec!["text".to_string()]),
                ..Default::default()
            }],
            ..Default::default()
        };

        let json_val = serde_json::to_value(&config).unwrap();
        assert_eq!(json_val["baseUrl"], "https://api.test.com/v1");
        assert_eq!(json_val["apiKey"], "sk-test");
        assert_eq!(json_val["api"], "openai-completions");
        assert_eq!(json_val["authHeader"], true);

        let models = json_val["models"].as_array().unwrap();
        assert_eq!(models.len(), 1);
        assert_eq!(models[0]["id"], "test-model");
        assert_eq!(models[0]["contextWindow"], 128000);
    }

    #[test]
    fn test_omp_provider_config_roundtrip() {
        let config = OmpProviderConfig {
            name: Some("Roundtrip".to_string()),
            base_url: "https://api.roundtrip.com".to_string(),
            api_key: "sk-round".to_string(),
            api: Some("anthropic-messages".to_string()),
            headers: Some({
                let mut h = HashMap::new();
                h.insert("X-Test".to_string(), "value".to_string());
                h
            }),
            models: vec![
                OmpModelConfig {
                    id: "model-1".to_string(),
                    name: Some("Model 1".to_string()),
                    context_window: Some(200000),
                    max_tokens: Some(32000),
                    ..Default::default()
                },
                OmpModelConfig {
                    id: "model-2".to_string(),
                    name: Some("Model 2".to_string()),
                    ..Default::default()
                },
            ],
            ..Default::default()
        };

        let json = serde_json::to_value(&config).unwrap();
        let deserialized: OmpProviderConfig = serde_json::from_value(json).unwrap();
        assert_eq!(deserialized.base_url, "https://api.roundtrip.com");
        assert_eq!(deserialized.models.len(), 2);
        assert_eq!(deserialized.models[0].id, "model-1");
    }
}
