{
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/release-23.11";
  inputs.gitignore = {
    url = "github:hercules-ci/gitignore.nix";
    # Use the same nixpkgs
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, flake-utils, gitignore }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          devShells = {
            backend = pkgs.mkShell {
              packages = with pkgs; [
                rustup
                rust-analyzer
                protobuf
                podman
                podman-compose
                llvmPackages.libclang
                clang
                llvmPackages.clangUseLLVM
                rust-bindgen
                lld
                llvm
              ];

              LIBCLANG_PATH = "${pkgs.libclang.lib}/lib";
              BINDGEN_EXTRA_CLANG_ARGS = (builtins.map (a: ''-I"${a}/include"'') [
                # add dev libraries here (e.g. pkgs.libvmi.dev)
                pkgs.glibc.dev
              ])
              # Includes with special directory paths
              ++ [
                ''-I"${pkgs.llvmPackages_latest.libclang.lib}/lib/clang/${pkgs.llvmPackages_latest.libclang.version}/include"''
                ''-I"${pkgs.glib.dev}/include/glib-2.0"''
                ''-I${pkgs.glib.out}/lib/glib-2.0/include/''
              ];

            };
            frontend = pkgs.mkShell {
              packages = with pkgs; [
                yarn
                nodejs_21
                yarn2nix
              ];
            };
          };

          packages =

            rec {
              # articleman-backend = { };
              # articleman-backend-docker = pkgs.dockerTools.buildLayeredImage {
              #   name = "am-backend";

              # };

              # THANK YOU OMG
              # https://github.com/knarkzel/sveltekit-nix/blob/master/flake.nix
              frontend =
                let
                  packageJSON = pkgs.lib.importJSON ./frontend/package.json;
                  gitignoreSource = gitignore.lib.gitignoreSource;
                in
                pkgs.mkYarnPackage rec {
                  name = "${packageJSON.name}-${version}";
                  version = packageJSON.version;
                  src = gitignoreSource ./frontend;
                  packageJson = "${src}/package.json";
                  yarnLock = "${src}/yarn.lock";
                  buildPhase = ''
                    yarn --offline build
                  '';
                  distPhase = "true";
                  installPhase = ''
                    mkdir -p $out/frontend
                    mv ./deps/${packageJSON.name}/build $out/frontend
                  '';
                };
            };

        }
      );
}
