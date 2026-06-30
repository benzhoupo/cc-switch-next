//! Omp (Oh My Pi) MCP 同步模块
//!
//! 处理 MCP 服务器配置与 `~/.omp/agent/mcp.yml` 的同步操作。

use std::collections::HashMap;

use serde_json::Value;

use crate::app_config::{McpApps, McpServer, MultiAppConfig};
use crate::error::AppError;

use super::validation::validate_server_spec;

/// Sync a single MCP server to Omp live config
pub fn sync_single_server_to_omp(
    _config: &MultiAppConfig,
    _id: &str,
    server_spec: &Value,
) -> Result<(), AppError> {
    crate::omp_config::set_mcp_server(_id, server_spec.clone())
}

/// Remove a single MCP server from Omp live config
pub fn remove_server_from_omp(id: &str) -> Result<(), AppError> {
    crate::omp_config::remove_mcp_server(id)
}

/// Import MCP servers from Omp to unified structure
///
/// Existing servers will have Omp app enabled without overwriting other fields.
pub fn import_from_omp(config: &mut MultiAppConfig) -> Result<usize, AppError> {
    let map = crate::omp_config::get_mcp_servers()?;
    if map.is_empty() {
        return Ok(0);
    }

    let servers = config.mcp.servers.get_or_insert_with(HashMap::new);

    let mut changed = 0;
    let mut errors = Vec::new();

    for (id, spec) in &map {
        if let Err(e) = validate_server_spec(spec) {
            log::warn!("Skip invalid Omp MCP server '{id}': {e}");
            errors.push(format!("{id}: {e}"));
            continue;
        }

        if let Some(existing) = servers.get_mut(id) {
            if !existing.apps.omp {
                existing.apps.omp = true;
                changed += 1;
                log::info!("MCP server '{id}' enabled for Omp");
            }
        } else {
            servers.insert(
                id.clone(),
                McpServer {
                    id: id.clone(),
                    name: id.clone(),
                    server: spec.clone(),
                    apps: McpApps {
                        claude: false,
                        codex: false,
                        gemini: false,
                        opencode: false,
                        hermes: false,
                        omp: true,
                    },
                    description: None,
                    homepage: None,
                    docs: None,
                    tags: Vec::new(),
                },
            );
            changed += 1;
            log::info!("Imported new MCP server '{id}' from Omp");
        }
    }

    if !errors.is_empty() {
        log::warn!(
            "Import completed with {} failures: {:?}",
            errors.len(),
            errors
        );
    }

    Ok(changed)
}
