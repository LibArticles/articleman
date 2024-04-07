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
                pkgs.stdenv.mkDerivation rec {
                  name = "articleman-frontend";
                  version = "0.2.0";
                  src = frontend-src;

                  yarnOfflineCache = pkgs.fetchYarnDeps {
                    yarnLock = src + "/yarn.lock";
                    hash = "sha256-ea70azelNB9ygjPHj1+/fU7TiWHDhjc28lS/BtpoLyQ=";
                  };

                  configurePhase = ''
                    runHook preConfigure

                    echo '--install.offline true' >> .yarnrc


                    ls $yarnOfflineCache


                    export HOME=$PWD
                    yarn config --offline set yarn-offline-mirror $yarnOfflineCache

                    fixup-yarn-lock yarn.lock

                    cat yarn.lock


                    yarn --offline --frozen-lockfile --ignore-platform --ignore-scripts --no-progress --non-interactive install


                    patchShebangs ./node_modules

                    runHook postConfigure
                  '';

                  nativeBuildInputs = with pkgs; [
                    nodejs_21
                    yarn
                    prefetch-yarn-deps
                  ];

                  # TODO: add check phase w/ vitest


                  buildPhase = ''
                    runHook preBuild

                    export NODE_OPTIONS=--openssl-legacy-provider
                    yarn --offline build

                    runHook postBuild
                  '';

                  installPhase = ''
                    runHook preInstall

                    mv build $out

                    runHook postInstall
                  '';

                };
            };

        }
      );
}
