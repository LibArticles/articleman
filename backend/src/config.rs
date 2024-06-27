rewriting static
rewriting static
rewriting static
rewriting static
rewriting static
rewriting static
use clap::Parser;
use serde::{Deserialize, Serialize};
use std::fmt::Display;
use std::str::FromStr;
use std::{env, fmt, fs};

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum LogMode {
    #[default]
    Human,
    Json,
}

impl Display for LogMode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            LogMode::Human => Display::fmt("HUMAN", f),
            LogMode::Json => Display::fmt("JSON", f),
        }
    }
}

impl FromStr for LogMode {
    type Err = LogModeError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_lowercase().as_str() {
            "human" => Ok(LogMode::Human),
            "json" => Ok(LogMode::Json),
            _ => Err(LogModeError(s.to_owned())),
        }
    }
}

#[derive(Debug, thiserror::Error)]
#[error("Unsupported log mode level `{0}`. Supported values are `HUMAN` and `JSON`.")]
pub struct LogModeError(String);

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum LogLevel {
    Off,
    Error,
    Warn,
    #[default]
    Info,
    Debug,
    Trace,
}

#[derive(Debug)]
pub struct LogLevelError {
    pub given_log_level: String,
}

impl Display for LogLevelError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        writeln!(
            f,
            "Log level '{}' is invalid. Accepted values are 'OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG', and 'TRACE'.",
            self.given_log_level
        )
    }
}

impl Display for LogLevel {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            LogLevel::Off => Display::fmt("OFF", f),
            LogLevel::Error => Display::fmt("ERROR", f),
            LogLevel::Warn => Display::fmt("WARN", f),
            LogLevel::Info => Display::fmt("INFO", f),
            LogLevel::Debug => Display::fmt("DEBUG", f),
            LogLevel::Trace => Display::fmt("TRACE", f),
        }
    }
}

impl std::error::Error for LogLevelError {}

impl FromStr for LogLevel {
    type Err = LogLevelError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_lowercase().as_str() {
            "off" => Ok(LogLevel::Off),
            "error" => Ok(LogLevel::Error),
            "warn" => Ok(LogLevel::Warn),
            "info" => Ok(LogLevel::Info),
            "debug" => Ok(LogLevel::Debug),
            "trace" => Ok(LogLevel::Trace),
            _ => Err(LogLevelError {
                given_log_level: s.to_owned(),
            }),
        }
    }
}

#[derive(Debug, clap::ValueEnum, Serialize, Deserialize, Clone, Default)]
pub enum Environment {
    #[default]
    Production,
    Development,
}

#[derive(Debug)]
pub struct EnvironmentError {
    pub given_log_level: String,
}

impl Display for Environment {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Environment::Development => Display::fmt("development", f),
            Environment::Production => Display::fmt("production", f),
        }
    }
}

impl FromStr for Environment {
    type Err = EnvironmentError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.trim().to_lowercase().as_str() {
            "production" => Ok(Environment::Production),
            "development" => Ok(Environment::Development),
            _ => Err(EnvironmentError {
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

#[derive(Debug, Clone, Parser, Deserialize)]
#[clap(version, next_display_order = None)]
#[serde(rename_all = "snake_case", deny_unknown_fields)]
pub struct Opt {
    /// Sets the PostgreSQL database that Articleman will connect to.
    #[clap(long, env = "ART_DB_CONN_STR")]
    pub db_conn_str: String,

    /// Defines the address that Articleman will bind its HTTPS API TCP socket to.
    #[clap(long, env = "ART_API_LISTEN_ADDR", default_value_t = default_api_listen_addr() )]
    pub api_listen_addr: String,

    /// Defines the address that Articleman will bind its insecure HTTP API socket to.
    #[clap(long, env = "ART_INSEC_API_LISTEN_ADDR", default_value_t = String::from(DEFAULT_INSEC_API_LISTEN_ADDR) )]
    pub insec_api_listen_addr: String,

    /// Defines the base path that the API is served at
    #[clap(long, env = "ART_API_BASE_PATH", default_value_t = String::from(DEFAULT_API_BASE_PATH) )]
    pub api_base_path: String,

    /// Defines the address that Articleman will bind its HTTPS web interface TCP socket to.
    #[clap(long, env = "ART_WEB_LISTEN_ADDR", default_value_t = String::from(DEFAULT_WEB_LISTEN_ADDR) )]
    pub web_listen_addr: String,

    /// Defines the address that Articleman will bind its insecure HTTP web interface socket to.
    #[clap(long, env = "ART_INSEC_WEB_LISTEN_ADDR", default_value_t = String::from(DEFAULT_INSEC_WEB_LISTEN_ADDR))]
    pub insec_web_listen_addr: String,

    /// Defines the base path that the API is served at.
    #[clap(long, env = "ART_WEB_BASE_PATH", default_value_t = String::from(DEFAULT_WEB_BASE_PATH) )]
    pub web_base_path: String,

    #[clap(long, value_enum, env = "ART_ENV", default_value_t = Environment::Production )]
    pub env: Environment,

    /// Specifies the path that Articleman loads its config from.
    #[clap(long)]
    pub config_file_path: Option<PathBuf>,
}

