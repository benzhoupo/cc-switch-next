use tauri::State;

use crate::omp_config;
use crate::store::AppState;

// ============================================================================
// omp Provider Commands
// ============================================================================

/// Import providers from omp live config to database.
///
/// omp uses additive mode — users may already have providers
/// configured in models.yml.
#[tauri::command]
pub fn import_omp_providers_from_live(state: State<'_, AppState>) -> Result<usize, String> {
    crate::services::provider::import_omp_providers_from_live(state.inner())
        .map_err(|e| e.to_string())
}

/// Get provider names in the omp live config.
#[tauri::command]
pub fn get_omp_live_provider_ids() -> Result<Vec<String>, String> {
    omp_config::get_providers()
        .map(|providers| providers.keys().cloned().collect())
        .map_err(|e| e.to_string())
}

/// Get a single omp provider fragment from live config.
#[tauri::command]
pub fn get_omp_live_provider(
    #[allow(non_snake_case)] providerId: String,
) -> Result<Option<serde_json::Value>, String> {
    omp_config::get_provider(&providerId).map_err(|e| e.to_string())
}
