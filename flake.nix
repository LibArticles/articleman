{
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/ff1a94e523ae9fb272e0581f068baee5d1068476";

  outputs = { self, nixpkgs, flake-utils }:
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
          
        }
      );
}