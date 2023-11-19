{
  description = "A Nix-flake-based Node.js development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }:
    let
      overlays = [
        (final: prev: {
          nodejs = prev.nodejs_21;
        })
      ];
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import nixpkgs { inherit overlays system; };
      });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }: {
        default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
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
          ];
        };
      });
    };
}
