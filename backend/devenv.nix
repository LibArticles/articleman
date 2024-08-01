{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = [ pkgs.git ];

  # https://devenv.sh/scripts/
  scripts.hello.exec = "echo hello from $GREET";

  enterShell = ''
    hello
    git --version
  '';

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep "2.42.0"
  '';

  services.postgres = {
    enable = true;
    package = pkgs.postgresql_15_jit;
    extensions = _: [
      (pkgs.callPackage "${inputs.supa_postgres.sourceInfo.outPath}/nix/ext/pg_jsonschema.nix" {})
    ];
    initialDatabases = [
      { name = "articleman"; }
    ];
  };
  
  services.meilisearch.enable = true;
  
  processes.kanidm = {
    exec = "${pkgs.kanidm}/bin/kanidmd server --config ../../../resources/kanidm.dev.config.toml";
    process-compose = {
      working_dir = "${config.env.DEVENV_STATE}/kanidm";
    };
  };
  
  process.before = ''
    mkdir -p ${config.env.DEVENV_STATE}/kanidm
  '';
  
  languages.rust = {
    enable = true;
    channel = "nightly";
    
  };

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/languages/
  # languages.nix.enable = true;

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # https://devenv.sh/processes/
  # processes.ping.exec = "ping example.com";

  # See full reference at https://devenv.sh/reference/options/
}
