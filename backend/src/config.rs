use clap::{command, Parser};
use serde::{Deserialize, Serialize};
use tokio::io::AsyncReadExt;
use std::fmt::Display;
use std::path::PathBuf;
use std::str::FromStr;
use std::{env, fmt, fs};
use merge::Merge;

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum AMLogMode {
    #[default]
    Human,
    Json,
}

impl Display for AMLogMode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AMLogMode::Human => Display::fmt("HUMAN", f),
            AMLogMode::Json => Display::fmt("JSON", f),
        }
    }
}

impl FromStr for AMLogMode {
    type Err = LogModeError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_lowercase().as_str() {
            "human" => Ok(AMLogMode::Human),
            "json" => Ok(AMLogMode::Json),
            _ => Err(LogModeError(s.to_owned())),
        }
    }
}

#[derive(Debug, thiserror::Error)]
#[error("Unsupported log mode level `{0}`. Supported values are `HUMAN` and `JSON`.")]
pub struct LogModeError(String);

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum AMLogLevel {
    Off,
    Error,
    Warn,
    #[default]
    Info,
    Debug,
    Trace,
}

#[derive(Debug)]
pub struct AMLogLevelError {
    pub given_log_level: String,
}

impl Display for AMLogLevelError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        writeln!(
            f,
            "Log level '{}' is invalid. Accepted values are 'OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', and 'TRACE'.",
            self.given_log_level
        )
    }
}

impl Display for AMLogLevel {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AMLogLevel::Off => Display::fmt("OFF", f),
            AMLogLevel::Error => Display::fmt("ERROR", f),
            AMLogLevel::Warn => Display::fmt("WARN", f),
            AMLogLevel::Info => Display::fmt("INFO", f),
            AMLogLevel::Debug => Display::fmt("DEBUG", f),
            AMLogLevel::Trace => Display::fmt("TRACE", f),
        }
    }
}

impl std::error::Error for AMLogLevelError {}

impl FromStr for AMLogLevel {
    type Err = AMLogLevelError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_lowercase().as_str() {
            "off" => Ok(AMLogLevel::Off),
            "error" => Ok(AMLogLevel::Error),
            "warn" => Ok(AMLogLevel::Warn),
            "info" => Ok(AMLogLevel::Info),
            "debug" => Ok(AMLogLevel::Debug),
            "trace" => Ok(AMLogLevel::Trace),
            _ => Err(AMLogLevelError {
                given_log_level: s.to_owned(),
            }),
        }
    }
}

#[derive(Debug, clap::ValueEnum, Serialize, Deserialize, Clone, Default)]
pub enum AMEnvironment {
    #[default]
    Production,
    Development,
}

#[derive(Debug)]
pub struct AMEnvironmentError {
    pub given_log_level: String,
}

impl Display for AMEnvironment {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AMEnvironment::Development => Display::fmt("development", f),
            AMEnvironment::Production => Display::fmt("production", f),
        }
    }
}

impl FromStr for AMEnvironment {
    type Err = AMEnvironmentError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_lowercase().as_str() {
            "production" => Ok(AMEnvironment::Production),
            "development" => Ok(AMEnvironment::Development),
            _ => Err(AMEnvironmentError {
                given_log_level: s.to_owned(),
            }),
        }
    }
}

const DEFAULT_API_LISTEN_ADDR: &str = "127.0.0.1:2780";
const DEFAULT_INSEC_API_LISTEN_ADDR: &str = "127.0.0.1:2880";
const DEFAULT_API_BASE_PATH: &str = "/api";
const DEFAULT_WEB_LISTEN_ADDR: &str = "127.0.0.1:2781";
const DEFAULT_INSEC_WEB_LISTEN_ADDR: &str = "127.0.0.1:2881";
const DEFAULT_WEB_BASE_PATH: &str = "/";
const DEFAULT_CONFIG_FILE_PATH: &str = "./articleman.config.toml";

// TERMINOLOGY:
// "Specifies": sets options where Articleman has external constraints, like enums and things that Articleman reads and ports that it connects to.
// "Defines": sets options that are Articleman's responsibility to manage. like listening on ports.
// this guidance is more of a nitpicky DX thing than a necessity.


#[derive(Debug, Clone, Parser, Deserialize, Merge)]
#[command(version, next_display_order = None)]
#[serde(rename_all = "snake_case", deny_unknown_fields)]
pub struct AMOpt {
    #[merge(skip)]
    /// Specifies the PostgreSQL database that Articleman will connect to.
    #[clap(long, env = "ART_DB_CONN_URL")]
    pub db_conn_url: Option<String>,

    #[merge(skip)]
    /// Defines the address that Articleman will bind its HTTPS API TCP socket to.
    #[clap(long, env = "ART_API_LISTEN_ADDR", default_value_t = String::from(DEFAULT_API_LISTEN_ADDR) )]
    pub api_listen_addr: String,

    #[merge(skip)]
    /// Defines the address that Articleman will bind its insecure HTTP API socket to.
    #[clap(long, env = "ART_INSEC_API_LISTEN_ADDR", default_value_t = String::from(DEFAULT_INSEC_API_LISTEN_ADDR) )]
    pub insec_api_listen_addr: String,

    #[merge(skip)]
    /// Defines the base path that the API is served at
    #[clap(long, env = "ART_API_BASE_PATH", default_value_t = String::from(DEFAULT_API_BASE_PATH) )]
    pub api_base_path: String,

    #[merge(skip)]
    /// Defines the address that Articleman will bind its HTTPS web interface TCP socket to.
    #[clap(long, env = "ART_WEB_LISTEN_ADDR", default_value_t = String::from(DEFAULT_WEB_LISTEN_ADDR) )]
    pub web_listen_addr: String,

    #[merge(skip)]
    /// Defines the address that Articleman will bind its insecure HTTP web interface socket to.
    #[clap(long, env = "ART_INSEC_WEB_LISTEN_ADDR", default_value_t = String::from(DEFAULT_INSEC_WEB_LISTEN_ADDR))]
    pub insec_web_listen_addr: String,

    #[merge(skip)]
    /// Defines the base path that the API is served at.
    #[clap(long, env = "ART_WEB_BASE_PATH", default_value_t = String::from(DEFAULT_WEB_BASE_PATH) )]
    pub web_base_path: String,

    #[merge(skip)]
    /// Specifies the type of environment that Articleman should set itself up for
    #[clap(long, short, value_enum, env = "ART_ENV", default_value_t = AMEnvironment::Production )]
    pub env: AMEnvironment,

    #[merge(skip)]
    /// Specifies the path that Articleman loads its config from.
    #[clap(long)]
    pub config_file_path: Option<PathBuf>,
}

// TODO: flesh this out similarly to meili's opts parsing. read toml, merge env variables, maybe accept the final cli options and make this a function call from the cli or main modules?
/// Returns a tuple with the parsed options, the config path and the writable status of the config file, if applicable.
impl AMOpt {
    pub async fn try_build_options(mut opts: AMOpt) -> Result<(AMOpt, Option<PathBuf>, bool), anyhow::Error> {
        let mut config_read_from = None;
        let mut is_writable = false;
        let user_specified_config_file_path = opts
            .config_file_path
            .clone()
            .or_else(|| env::var("MEILI_CONFIG_FILE_PATH").map(PathBuf::from).ok());
        let config_file_path = user_specified_config_file_path
            .clone()
            .unwrap_or_else(|| PathBuf::from(DEFAULT_CONFIG_FILE_PATH));

        match tokio::fs::File::open(&config_file_path).await {
            Ok(mut config_file) => {
                let mut config_str = String::from("");
                let _ = config_file.read_to_string(&mut config_str).await;
                // If the file is successfully read, we deserialize it with `toml`.
                let opts_from_config = toml::from_str::<AMOpt>(&config_str)?;
                // Return an error if config file contains 'config_file_path'
                // Using that key in the config file doesn't make sense bc it creates a logical loop (config file referencing itself)
                if opts_from_config.config_file_path.is_some() {
                    anyhow::bail!("`config_file_path` isn't supported in the configuration file. Imports may be supported in the future.")
                }
                opts.merge(opts_from_config);
                config_read_from = Some(config_file_path);
                if let Ok(file_metadata) = config_file.metadata().await {
                    is_writable = !file_metadata.permissions().readonly();
                }

            }
            Err(e) => {
                if let Some(path) = user_specified_config_file_path {
                    // If we have an error while reading the file defined by the user.
                    anyhow::bail!(
                        "unable to open or read the configuration file at {:?}: {}.",
                        path,
                        e,
                    );
                }
            }
        }

        Ok((opts, config_read_from, is_writable))
    }
}
