{ pkgs ? import <nixpkgs> {}}:

pkgs.mkShell {
  nativeBuildInputs =
    [ pkgs.nodePackages.firebase-tools
      pkgs.nodejs_20
    ];
}
