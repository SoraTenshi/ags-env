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
            pkg-config
            meson
            ninja
            typescript
            python3
            wrapGAppsHook
            gobject-introspection
            gjs
            gtk3
            libpulseaudio
            upower
            gnome.gnome-bluetooth
            libsoup_3
            gtk-layer-shell
            glib-networking
            networkmanager
            libdbusmenu-gtk3
            gvfs
            node2nix
            nodejs
            glibc
          ];
        };
      });
    };
}
