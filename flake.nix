{
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/ff1a94e523ae9fb272e0581f068baee5d1068476";
  inputs.frontend-src = {
    url = "path:frontend";
    flake = false;
  };

  outputs = { self, nixpkgs, flake-utils, frontend-src }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          devShells = {
            backend = pkgs.mkShell {
              packages = with pkgs; [
                rustc
                cargo
                protobuf
                llvmPackages.libclang
                clang
                llvmPackages.clangUseLLVM
                rust-bindgen
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
                bun
                nodejs_21
              ];
            };
          };

          packages =

            rec {
              articleman-backend = { };
              articleman-backend-docker = pkgs.dockerTools.buildLayeredImage { };

              articleman-frontend =
                let
                  js2nix = pkgs.callPackage
                    (builtins.fetchGit {
                      url = "ssh://git@github.com/canva-public/js2nix.git";
                      ref = "main";
                    })
                    { };
                  mods = js2nix.buildEnv {
                    package-json = ./frontend/package.json;
                    yarn-lock = ./frontend/yarn.lock;
                    
                  };
                in
                pkgs.stdenv.mkDerivation {
                  name = "articleman-frontend";
                  version = "0.2.0";
                  src = frontend-src;

                  unpackPhase = ''
                    ln -sT ${mods.nodeModules} ./node_modules || true
                  '';

                  buildInputs = with pkgs; [
                    nodejs_21

                  ];

                  buildPhase = ''
                    ./node_modules/.bin/vite build --mode production
                  '';

                  # TODO: add check phase w/ vitest

                  installPhase = ''
                    cp ./build/* $out/
                  '';

                };
            };

        }
      );
}
