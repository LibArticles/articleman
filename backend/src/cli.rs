use clap::{builder::styling, crate_authors, crate_name, Command};

pub async fn gen_cmd_iface() -> Command {
    let styles = styling::Styles::styled()
        .header(styling::AnsiColor::Yellow.on_default() | styling::Effects::BOLD);
    Command::new(crate_name!())
        .help_expected(true)
        .styles(styles)
        .author(crate_authors!(" and "))
        .about("Articleman: The best project management tool on the planet.")
        .long_about("Articleman Oxide: The fastest API server for the best project management tool on the planet.")
        .subcommand(Command::new("server").subcommand(Command::new("start")))
}

pub async fn parse() -> Action {
    let iface = gen_cmd_iface().await;
    let matches = iface.get_matches();

    if let Some((opt_name, opt_sub_matches)) = matches.subcommand() {
        match opt_name {
            "server" => {
                if let Some((server_opt_name, server_opt_sub_matches)) =
                    opt_sub_matches.subcommand()
                {
                    match server_opt_name {
                        "start" => {
                            return Action::ServerStart(ServerTarget::APIOnly)
                        }
                        _ => {
                            return Action::NoOp;
                        }
                    }
                } else {
                    return Action::NoOp;
                }
            }
            _ => return Action::NoOp,
        }
    } else {
        return Action::NoOp;
    }
}

pub enum Action {
    ServerStart(ServerTarget),
    ServerStop(ServerTarget),
    
    NoOp
}

pub enum ServerTarget {
    APIOnly,
    FrontendOnly,
    AllServices,
}