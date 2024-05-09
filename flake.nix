{
  description = "A Nix-flake-based AGS development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }:
    let
      overlays = [
        (final: prev: {
          nodejs = prev.nodejs;
        })
      ];
      supportedSystems = [ "x86_64-linux" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import nixpkgs { inherit overlays system; };
      });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }: {
        default = pkgs.mkShell {
          buildInputs = with pkgs; [
            ags
            bun
            gjs
            glib-networking
            glibc
            gnome.gnome-bluetooth
            gobject-introspection
            gtk-layer-shell
            gtk3
            gvfs
            libdbusmenu-gtk3
            libpulseaudio
            libsoup_3
            meson
            networkmanager
            ninja
            node2nix
            nodejs
            pkg-config
            python3
            typescript
            upower
            wrapGAppsHook
          ];
        };
      });
    };
}
