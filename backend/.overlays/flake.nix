{
  outputs = { ... }: {
    overlays = {
      cargo-pgrx = final: prev: {
        #cargo-pgrx_0_11_3 = cargo-pgrx.cargo-pgrx_0_11_3;

        buildPgrxExtension_0_11_3 = prev.buildPgrxExtension.override {
          cargo-pgrx = final.cargo-pgrx_0_11_3;
        };
      };
      gdal-small = final: prev: {
        # override the version of gdal used with postgis with the small version.
        # significantly reduces overall closure size
        gdal = prev.gdalMinimal.override {
          /* other features can be enabled, reference:
                https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/libraries/gdal/default.nix
                */

          # useHDF = true;
          # useArrow = true;
          # useLibHEIF = true;
          # ...
        };
      };
      postgis = final: prev: {
        postgis = prev.postgresqlPackages.postgis.overrideAttrs (old: {
          version = "3.3.2";
          sha256 = "";
        });
        postgresqlPackages.postgis = final.postgis;
      };
      psql_16-oriole = final: prev: {
        postgresql_16 = prev.postgresql_16.overrideAttrs (old: {
          pname = "postgresql_16";
          version = "16_23";
          src = prev.fetchurl {
            url = "https://github.com/orioledb/postgres/archive/refs/tags/patches16_23.tar.gz";
            sha256 = "sha256-xWmcqn3DYyBG0FsBNqPWTFzUidSJZgoPWI6Rt0N9oJ4=";
          };
          buildInputs = old.buildInputs ++ [
            prev.bison
            prev.docbook5
            prev.docbook_xsl
            prev.docbook_xsl_ns
            prev.docbook_xml_dtd_45
            prev.flex
            prev.libxslt
            prev.perl
          ];
        });
        postgresql_orioledb_16 = final.postgresql_16;
      };
      
    };
  };
}
