use clap::{command, Parser, Subcommand, ValueHint};

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    /// run Articleman in development mode
    #[arg(short, long)]
    dev: bool,

    /// set a PostgreSQL connection string to use for this instance of Articleman
    #[arg(short = 'c', long, value_hint = ValueHint::Url)]
    database_connection: Option<String>,

    #[command(subcommand)]
    cmd: Commands,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Manually run an ordinarily scheduled job
    Task {
        #[arg(short, long, required = true)]
        name: String,
    },
}

pub async fn parse() {
    let args = Args::parse();

    let is_dev = args.dev;

    println!("{is_dev}")
}
