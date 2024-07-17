use crate::config;
use clap::{builder::styling, command, crate_authors, crate_name, Command, CommandFactory, Parser};

/// Articleman
#[derive(Parser, Debug)]
#[command(version, about, help_expected = true, next_display_order = None)]
pub enum Cli {
    #[command(subcommand, name = "server")]
    Server(ServerCli),
}

#[derive(Parser, Debug)]
#[command(version, help_expected = true, next_display_order = None)]
pub enum ServerCli {
    // #[command(subcommand, name = "start")]
    Start(config::AMOpt),
}

pub async fn parse() -> Result<Action, anyhow::Error> {
    let matches = Cli::parse();
    tracing::debug!("parsed CLI arguments");
    let final_options: config::AMOpt;
    let Cli::Server(ServerCli::Start(ref options)) = matches;
    match config::AMOpt::try_build_options(options.clone()).await {
        Ok((recvd_options, _config_path, _is_writable)) => {
            final_options = recvd_options;
            Ok(Action::ServerStart(final_options))
        }
        Err(err_reason) => {
            anyhow::bail!("Couldn't parse CLI options: {:?}", err_reason);
        }
    }
}

pub enum Action {
    ServerStart(config::AMOpt),

    NoOp,
}
